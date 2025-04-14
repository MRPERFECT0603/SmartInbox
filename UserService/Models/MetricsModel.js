const mongoose = require("mongoose");

const MetricsSchema = mongoose.Schema(
    {
        mailCronJob: {
            mailIdFetched: { type: Number, default: 0 },
            mailIdPushed: { type: Number, default: 0 },
            lastFetchedAt: { type: Date, default: null }, 
            lastPushedAt: { type: Date, default: null },  
          },
        
          mailService: {
            mailsFetched: { type: Number, default: 0 },
            mailIdPulled: { type: Number, default: 0 },
            mailsPreprocessed: { type: Number, default: 0 },
            mailsPushed: { type: Number, default: 0 },
            responsePulled: { type: Number, default: 0 },
            responseSent: { type: Number, default: 0 },
            labelsChanged: { type: Number, default: 0 },
            lastProcessedAt: { type: Date, default: null }, 
          },
        
          responseService: {
            mailsPulled: { type: Number, default: 0 },
            responseGenerated: { type: Number, default: 0 },
            responsePushed: { type: Number, default: 0 },
            lastResponseAt: { type: Date, default: null }, 
          },
        
          createdAt: { type: Date, default: Date.now }, 
          stoppedAt: { type: Date, default: Date.now }, 
    },
    {
        timestamps: true,
    }
);

MetricsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });
  

module.exports = mongoose.model("Metrics", MetricsSchema);