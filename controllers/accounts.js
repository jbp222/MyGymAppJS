'use strict';

const membersStore = require('../models/member-store');
const trainersStore = require('../models/trainer-store');

const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

    index(request, response) {
        const viewData = {
            title: 'Login or Signup',
        };
        response.render('index', viewData);
    },

    login(request, response) {
        const viewData = {
            title: 'Login to the Service',
        };
        response.render('login', viewData);
    },

    logout(request, response) {
        response.cookie('gym', '');
        response.redirect('/');
    },

    signup(request, response) {
        const viewData = {
            title: 'Login to the Service',
        };
        response.render('signup', viewData);
    },

    register(request, response) {
        const member = request.body;
        member.id = uuid();
        member.assessments = [];
        member.goals = [];
        membersStore.addMember(member);
        logger.info(`registering ${member.email}`);
        response.redirect('/');
    },

    authenticate(request, response) {
        const member = membersStore.getMemberByEmail(request.body.email);
        if (member && member.password === request.body.password) {
            response.cookie('gym', member.email);
            logger.info(`logging in ${member.email}`);
            response.redirect('/dashboard');
        } else {
            const trainer = trainersStore.getTrainerByEmail(request.body.email);
            if (trainer && trainer.password === request.body.password) {
                response.cookie('gym', trainer.email);
                logger.info(`logging in ${trainer.email}`);
                response.redirect('/trainerdashboard');
            }
        }
        response.redirect('/login');
    },

    getCurrentMember(request) {
        const memberEmail = request.cookies.gym;
        return membersStore.getMemberByEmail(memberEmail);
    },

    getCurrentTrainer(request) {
        const trainerEmail = request.cookies.gym;
        return trainersStore.getTrainerByEmail(trainerEmail);
    },

    // the this keyword would not work when calling getCurrentMember from this method,
    // I copied the code from the method into this one to work around it.
    formForMemberUpdate(request, response) {
        const memberEmail = request.cookies.gym;
        const member = membersStore.getMemberByEmail(memberEmail);
        const viewData = {
            title: 'Settings',
            member: member,
        };
        logger.info(`rendering update for member: ${member.id}`);
        response.render('updatemember', viewData);
    },

    updateMember(request, response) {
        const updatedMember = request.body;
        const memberEmail = request.cookies.gym;
        membersStore.updateMember(memberEmail, updatedMember);
        logger.info(`Updating member: ${memberEmail}`);
        response.redirect('/dashboard');
    },
};

module.exports = accounts;