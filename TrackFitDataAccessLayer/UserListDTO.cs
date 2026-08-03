using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackFitDataAccessLayer
{
    public class UserListDTO
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public string EmailId { get; set; }

        public int Score { get; set; }

        public int CurrentStreak { get; set; }

        public DateTime? LastActiveDate { get; set; }
    }
}
