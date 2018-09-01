'use strict';

const membersStore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics');

const dashboard = {

    index(request, response) {
        const member = accounts.getCurrentMember(request);
        logger.info(`rendering dashboard for member ${member.id}`);
        const bmi = analytics.calculateBMI(member);
        const bmiCategory = analytics.determineBMICategory(bmi);
        const isIdealBodyWeight = analytics.isIdealBodyWeight(member);
        logger.info("ideal body weight: " + isIdealBodyWeight);
        const viewData = {
            title: 'dashboard',
            member: member,
            assessments: member.assessments.reverse(),
            bmi: bmi,
            bmiCategory: bmiCategory,
            isIdealBodyWeight: isIdealBodyWeight,
        };
        response.render('dashboard', viewData);
    },

    addAssessment(request, response) {
        const assessment = request.body;
        assessment.id = uuid();
        assessment.comment = [];
        const date = new Date();
        assessment.date = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString();
        assessment.time = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
        const member = accounts.getCurrentMember(request);
        logger.info(`adding assessment id: ${assessment.id} for member id: ${member.id}`);
        membersStore.addAssessment(member, assessment);
        response.redirect('/dashboard');
    },

    deleteAssessment(request, response) {
        const member = accounts.getCurrentMember(request);
        const assessmentId = request.params.assessmentId;
        logger.info(`deleting assessment id: ${assessmentId} from member id: ${member.id}`);
        membersStore.deleteAssessment(member, assessmentId);
        response.redirect('/dashboard');
    },

    addGoal(request, response) {
        const goal = request.body;
        goal.id = uuid();
        const member = accounts.getCurrentMember(request);
        logger.info(`adding goal for member id: ${member.id}`);
        membersStore.addGoal(member, goal);
        response.redirect('/dashboard');
    },
};

module.exports = dashboard;
