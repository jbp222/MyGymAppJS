'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');

const membersStore = {

    store: new JsonStore('./models/member-store.json', {members: []}),
    collection: 'members',

    getAllMembers() {
        return this.store.findAll(this.collection);
    },

    addMember(member) {
        this.store.add(this.collection, member);
        this.store.save();
    },

    deleteMember(memberId) {
        const member = this.getMemberById(memberId);
        this.store.remove(this.collection, member);
        this.store.save();
    },

    getMemberById(id) {
        return this.store.findOneBy(this.collection, {id: id});
    },

    getMemberByEmail(email) {
        return this.store.findOneBy(this.collection, {email: email});
    },

    updateMember(email, updatedMember) {
        const member = this.getMemberByEmail(email);
        member.name = updatedMember.name;
        member.email = updatedMember.email;
        member.gender = updatedMember.gender;
        member.height = updatedMember.height;
        member.startingweight = updatedMember.startingweight;
        member.password = updatedMember.password;
        this.store.save();
    },

    addAssessment(member, assessment) {
        member.assessments.push(assessment);
        // creating a Date object from the stored date string (assessment.date) and then getting the epoch for easy comparison
        const assessmentDate = new Date(assessment.date).getTime();
        logger.info("assessment date: " + assessmentDate);
        for (let i = 0; i < member.goals.length; i++) {
            const goalDate = new Date(member.goals[i].futuredate).getTime();
            logger.info("goal date: " + goalDate);
            if (assessmentDate === goalDate && member.goals[i].status === "Open") {
                logger.info("assessment date and goal dates matched");
                if (assessment.weight <= member.goals[i].measurement) {
                    member.goals[i].status = "Achieved";
                } else {
                    member.goals[i].status = "Missed";
                }
            } else if (assessmentDate > goalDate && member.goals[i].status === "Open") {
                logger.info("assessment date was greater than the goal date and the goal status was Open");
                member.goals[i].status = "Missed";
            }
        }
        this.store.save();
    },

    deleteAssessment(member, assessmentId) {
        const assessments = member.assessments;
        _.remove(assessments, {id: assessmentId});
        this.store.save();
    },

    getAssessment(member, assessmentId) {
        const assessments = member.assessments;
        return _.find(assessments, {id: assessmentId});
    },

    addComment(comment, member, assessmentId) {
        const assessment = this.getAssessment(member, assessmentId);
        assessment.comment = comment;
        this.store.save();
    },

    addGoal(member, goal) {
        member.goals.push(goal);
        this.store.save();
    },

};

module.exports = membersStore;