using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackFitDataAccessLayer.Models;

namespace TrackFitDataAccessLayer
{
    public class FeedbackRepo
    {
        private TrackFitDbContext context;
        public FeedbackRepo(TrackFitDbContext _context) { 
            this.context = _context;
        }

        public int SubmitFeedbackForm(int UserId, int Rating, string Message, DateTime CreatedDate)
        {
            int feedbackId = -1;
            Feedback feedback = new();
            feedback.UserId = UserId;
            feedback.Rating = Rating;
            feedback.Message = Message;
            feedback.CreatedDate = CreatedDate;
            try
            {
                context.Feedbacks.Add(feedback);
                context.SaveChanges();
                feedbackId = feedback.FeedbackId;
            }
            catch (Exception)
            {
                feedbackId = -1;
            }
            return feedbackId;
        }

        public int UpdateFeedback(int feedBackId, int Rating, string Message, DateTime CreatedDate)
        {
            int status = 0;
            try
            {
                var feedback = context.Feedbacks.Find(feedBackId);
                feedback.Message = Message;
                feedback.Rating = Rating;
                status = 1;
                feedback.CreatedDate = CreatedDate;
                context.SaveChanges();
            }
            catch (Exception)
            {
                status = -1;
            }

            return status;
        }

        public List<Feedback> GetMyFeedbacks()
        {
            List<Feedback> feedbacks = new();

            return feedbacks;
        }
    }
}
