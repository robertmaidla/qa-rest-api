'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//---Functions
    // sort answers array (more votes && recent update == higher position)
const sortAnswers = function(a, b) {
    // return 
        // - negative if a before b
        // 0          if no change
        // + positive if b before a
    if (a.votes === b.votes) {
        return b.updatedAt - a.updatedAt;
    }
    return b.votes - a.votes;
};

//---Schemas
    // Answer schema
var AnswerSchema = new Schema({
    text:       String,
    createdAt:  {type: Date, default: Date.now},
    updatedAt:  {type: Date, default: Date.now},
    votes:      {type: Number, default: 0}
});

    // on update, update the 'updatedAt' prop
AnswerSchema.method('update', function(updates, callback) {
    Object.assign(this, updates, {updatedAt: new Date()});
    // save the parent (Question) document
    this.parent().save(callback);
});

    // on vote, update the 'votes' prop
AnswerSchema.method('vote', function(vote, callback) {
    if (vote === 'up') {
        this.votes += 1;
    } else {
        this.votes -=1;
    }
    // save the parent (Question) document
    this.parent().save(callback);
});

    // Question schema
var QuestionSchema = new Schema({
    text:       String,
    createdAt:  {type: Date, default: Date.now},
    answers:    [AnswerSchema]
});

    // sort answers array before saving question
    // NB! ARROW FUNCTION NOTATION BREAKS THIS
QuestionSchema.pre('save', function(next) {
    if (this.answers) {
        this.answers.sort(sortAnswers);
    }
    next();
});

//---Exports
var Question = mongoose.model('Question', QuestionSchema);

module.exports.Question = Question;