const Metrics = require("../Models/MetricsModel");

const createMetricsDocument = async() => {
    try {
        const newMetrics = new Metrics({
            mailCronJob: {
                mailIdFetched: 0,
                mailIdPushed: 0,
                lastFetchedAt: null,
                lastPushedAt: null
            },
            mailService: {
                mailsFetched: 0,
                mailIdPulled: 0,
                mailsPreprocessed: 0,
                mailsPushed: 0,
                responsePulled: 0,
                responseSent: 0,
                labelsChanged: 0,
                lastProcessedAt: null
            },
            responseService: {
                mailsPulled: 0,
                responseGenerated: 0,
                responsePushed: 0,
                lastResponseAt: null
            },
        });

        const savedMetrics = await newMetrics.save();
        console.log('New Metrics document created, at ' + Date.now());
    } catch (error) {
        console.error('Error creating new Metrics document:', error);
    }
}


const Increment = async (serviceMetrics) => {
    try {
        const result = await Metrics.findOneAndUpdate(
            {}, 
            { $inc: { [serviceMetrics] : 1 } }, 
            { sort: { createdAt: -1 }, new: true } 
        );

        if (result) {
            console.log('Most recent document Incremented.');
        } else {
            console.log('No document found to update.');
        }
    } catch (error) {
        console.error('Error updating the most recent document:', error);
    }
}

const Decrement = async (serviceMetrics) => {
    try {
        const result = await Metrics.findOneAndUpdate(
            {}, 
            { $inc: { [serviceMetrics] : -1 } }, 
            { sort: { createdAt: -1 }, new: true }
        );

        if (result) {
            console.log('Most recent document Decremented.');
        } else {
            console.log('No document found to update.');
        }
    } catch (error) {
        console.error('Error updating the most recent document:', error);
    }
}


module.exports = {createMetricsDocument , Increment  , Decrement}