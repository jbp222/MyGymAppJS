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
    const member = accounts.getCurrentMember(request);
    logger.info(`adding assessment id: ${assessment.id} for member id: ${member.id}`);
    membersStore.addAssessment(member, assessment);
    response.redirect('/dashboard');
  },

};

module.exports = dashboard;
