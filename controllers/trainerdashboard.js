'use strict';

const membersStore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');
const accounts = require('./accounts.js');

const trainerdashboard = {

    index(request, response) {
        const members = membersStore.getAllMembers();
        logger.info(`rendering trainer dashboard`);
        const viewData = {
            title: 'trainer dashboard',
            members: members,
        };
        response.render('trainerdashboard', viewData);
    },

    trainerAssessment(request, response) {
        const member = membersStore.getMemberById(request.params.memberId);
        const assessments = member.assessments;
        const viewData = {
            title: 'trainer assessment',
            member: member,
            assessments: assessments.reverse(),
        };
        logger.info(`rendering members assessments`);
        response.render('listassessments', viewData);
    },

    addComment(request, response) {
        const comment = request.body.comment;
        const member = membersStore.getMemberById(request.params.memberId);
        membersStore.addComment(comment, member, request.params.assessmentId);
        logger.info(`Adding comment: ${comment}`);
        response.redirect('/listassessments/' + request.params.memberId);
    },

    deleteMember(request, response) {
        membersStore.deleteMember(request.params.memberId);
        logger.info(`Deleting member: ` + request.params.memberId);
        response.redirect('/trainerdashboard');
    },

    addGoal(request, response) {
        const goal = request.body;
        goal.id = uuid();
        const member = membersStore.getMemberById(request.params.memberId);
        logger.info(`adding goal for member id: ${member.id}`);
        membersStore.addGoal(member, goal);
        response.redirect('/trainerdashboard');
    },
};

module.exports = trainerdashboard;
