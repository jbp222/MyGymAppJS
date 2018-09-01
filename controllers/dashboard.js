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
            // reverse the order of the assessments array
            // (when created they are added to the end of the array, so reversing the array is a chronological reverse)
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
        assessment.time = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
        // using international standard time, then splitting on letter 'T' and taking the date only.
        // http://monkeyraptor.johanpaul.net/2015/09/javascript-how-to-extract-date-from-iso.html
        assessment.date = date.toISOString().split('T')[0];
        const member = accounts.getCurrentMember(request);
        assessment.trend = analytics.determineTrend(member, assessment.weight);
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
        goal.status = "Open";
        const member = accounts.getCurrentMember(request);
        logger.info(`adding goal for member id: ${member.id}`);
        membersStore.addGoal(member, goal);
        response.redirect('/dashboard');
    },
};

module.exports = dashboard;
