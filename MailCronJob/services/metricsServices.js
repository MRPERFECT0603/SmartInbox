const Metrics = require("../Models/MetricsModel");

/**
 * Creates a new Metrics document with default values
 * Initializes counters for mailCronJob, mailService, and responseService
 */
const createMetricsDocument = async () => {
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

        console.log(JSON.stringify({
            level: 'info',
            service: 'metrics-service_mailcronjob',
            event: 'create_metrics',
            message: 'New Metrics document created',
            timestamp: new Date().toISOString(),
            documentId: savedMetrics._id
        }));
    } catch (error) {
        console.error(JSON.stringify({
            level: 'error',
            service: 'metrics-service_mailcronjob',
            event: 'create_metrics_error',
            message: 'Error creating new Metrics document',
            error: error.message,
            timestamp: new Date().toISOString()
        }));
    }
};

/**
 * Increments a nested field in the most recent Metrics document
 * @param {string} serviceMetrics - The dot-notated path to the metric to increment (e.g., 'mailService.mailsFetched')
 */
const Increment = async (serviceMetrics) => {
    try {
        const result = await Metrics.findOneAndUpdate(
            {},
            { $inc: { [serviceMetrics]: 1 } },
            { sort: { createdAt: -1 }, new: true }
        );

        console.log(JSON.stringify({
            level: 'info',
            service: 'metrics-service_mailcronjob',
            event: 'increment_metric',
            metric: serviceMetrics,
            success: !!result,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error(JSON.stringify({
            level: 'error',
            service: 'metrics-service_mailcronjob',
            event: 'increment_metric_error',
            metric: serviceMetrics,
            message: error.message,
            timestamp: new Date().toISOString()
        }));
    }
};

/**
 * Decrements a nested field in the most recent Metrics document
 * @param {string} serviceMetrics - The dot-notated path to the metric to decrement (e.g., 'responseService.responsePushed')
 */
const Decrement = async (serviceMetrics) => {
    try {
        const result = await Metrics.findOneAndUpdate(
            {},
            { $inc: { [serviceMetrics]: -1 } },
            { sort: { createdAt: -1 }, new: true }
        );

        console.log(JSON.stringify({
            level: 'info',
            service: 'metrics-service_mailcronjob',
            event: 'decrement_metric',
            metric: serviceMetrics,
            success: !!result,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error(JSON.stringify({
            level: 'error',
            service: 'metrics-service_mailcronjob',
            event: 'decrement_metric_error',
            metric: serviceMetrics,
            message: error.message,
            timestamp: new Date().toISOString()
        }));
    }
};

module.exports = { createMetricsDocument, Increment, Decrement };