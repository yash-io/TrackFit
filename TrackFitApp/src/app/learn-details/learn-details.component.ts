import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-learn-details',
  templateUrl: './learn-details.component.html',
  styleUrls: ['./learn-details.component.css']
})
export class LearnDetailsComponent {

  content: any;

  constructor(private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');

    
    const data: any = {

      1: {
        title: 'Healthy Eating',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
        sections: [
          {
            heading: 'Why Healthy Eating Matters',
            text: 'Maintaining a balanced diet is essential for overall well-being. The food you consume directly impacts your energy levels, focus, and long-term health. Healthy eating is not about strict restrictions, but about providing your body with the nutrients it needs to function efficiently.'
          },
          {
            heading: 'Benefits of a Balanced Diet',
            points: [
              'Sustained energy levels throughout the day',
              'Improved mood and mental clarity',
              'Better concentration and productivity',
              'Stronger immune system'
            ]
          },
          {
            heading: 'Practical Habits to Follow',
            points: [
              'Include fresh fruits and vegetables in daily meals',
              'Reduce intake of processed and sugary foods',
              'Maintain portion control',
              'Stay consistent with meal timings'
            ]
          },
          {
            heading: 'Common Mistakes to Avoid',
            points: [
              'Skipping meals frequently',
              'Eating too quickly without proper chewing',
              'Overdependence on packaged foods',
              'Neglecting hydration'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'Small and consistent dietary improvements can lead to significant long-term health benefits. Focus on building sustainable habits rather than aiming for perfection.'
          }
        ]
      },

      2: {
        title: 'Workout Basics',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
        sections: [
          {
            heading: 'Importance of Regular Exercise',
            text: 'Regular physical activity plays a crucial role in maintaining both physical and mental health. Exercise helps improve endurance, strength, and overall quality of life.'
          },
          {
            heading: 'Benefits of Exercise',
            points: [
              'Increased energy and stamina',
              'Reduced stress and anxiety levels',
              'Improved sleep quality',
              'Enhanced physical strength'
            ]
          },
          {
            heading: 'Getting Started',
            points: [
              'Begin with simple activities like walking or jogging',
              'Incorporate basic exercises such as squats and push-ups',
              'Warm up before and cool down after workouts',
              'Start with shorter sessions and gradually increase duration'
            ]
          },
          {
            heading: 'Common Mistakes',
            points: [
              'Overtraining in the initial stages',
              'Ignoring proper form and posture',
              'Skipping warm-up routines',
              'Comparing progress with others'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'Consistency is more important than intensity. Regular moderate exercise yields better results than irregular intense workouts.'
          }
        ]
      },

      3: {
        title: 'Hydration Tips',
        image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc',
        sections: [
          {
            heading: 'Why Hydration is Essential',
            text: 'Water is vital for nearly every function in the body. Proper hydration supports digestion, circulation, and temperature regulation, while also improving overall performance.'
          },
          {
            heading: 'Benefits of Staying Hydrated',
            points: [
              'Improved energy and alertness',
              'Better concentration and cognitive function',
              'Healthier skin and digestion',
              'Reduced fatigue and headaches'
            ]
          },
          {
            heading: 'Simple Hydration Practices',
            points: [
              'Drink water regularly throughout the day',
              'Carry a water bottle for convenience',
              'Consume water-rich fruits and vegetables',
              'Drink water before feeling thirsty'
            ]
          },
          {
            heading: 'Common Mistakes',
            points: [
              'Ignoring early signs of dehydration',
              'Replacing water with sugary beverages',
              'Insufficient water intake during workouts',
              'Neglecting hydration in cooler weather'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'Maintaining consistent hydration is a simple yet powerful habit that significantly improves overall health and daily performance.'
          }
        ]
      },

      4: {
        title: 'Weight Loss',
        image: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74',
        sections: [
          {
            heading: 'Understanding Weight Loss',
            text: 'Healthy weight loss focuses on sustainable lifestyle changes rather than quick fixes. It involves balancing nutrition, physical activity, and consistency.'
          },
          {
            heading: 'Benefits of Healthy Weight Loss',
            points: [
              'Improved energy and stamina',
              'Better cardiovascular health',
              'Enhanced confidence and well-being',
              'Reduced risk of chronic diseases'
            ]
          },
          {
            heading: 'Effective Strategies',
            points: [
              'Maintain a balanced and nutritious diet',
              'Control portion sizes instead of skipping meals',
              'Combine cardio and strength training',
              'Stay consistent with daily habits'
            ]
          },
          {
            heading: 'Common Mistakes',
            points: [
              'Following extreme or crash diets',
              'Skipping meals frequently',
              'Relying only on exercise without diet control',
              'Expecting immediate results'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'Sustainable progress is more effective than rapid changes. Focus on consistency and long-term habits for lasting results.'
          }
        ]
      },

      5: {
        title: 'Sleep & Recovery',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
        sections: [
          {
            heading: 'Why Sleep is Important',
            text: 'Sleep plays a critical role in physical recovery and mental well-being. It allows your body to repair, recharge, and function efficiently.'
          },
          {
            heading: 'Benefits of Good Sleep',
            points: [
              'Improved energy and productivity',
              'Better memory and concentration',
              'Stronger immune system',
              'Reduced stress levels'
            ]
          },
          {
            heading: 'Healthy Sleep Habits',
            points: [
              'Maintain a consistent sleep schedule',
              'Avoid screens before bedtime',
              'Create a calm sleeping environment',
              'Limit caffeine intake in the evening'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'Quality sleep is as important as diet and exercise for overall health.'
          }
        ]
      },

      6: {
        title: 'Mental Wellness',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        sections: [
          {
            heading: 'Understanding Mental Health',
            text: 'Mental wellness is essential for maintaining emotional balance and handling daily challenges effectively.'
          },
          {
            heading: 'Benefits of Mental Wellness',
            points: [
              'Improved focus and clarity',
              'Better emotional control',
              'Reduced anxiety and stress',
              'Stronger relationships'
            ]
          },
          {
            heading: 'Simple Practices',
            points: [
              'Practice meditation or mindfulness',
              'Take regular breaks',
              'Stay socially connected',
              'Engage in hobbies'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'A healthy mind leads to a productive and fulfilling life.'
          }
        ]
      },

      7: {
        title: 'Muscle Building',
        image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e',
        sections: [
          {
            heading: 'Basics of Muscle Growth',
            text: 'Muscle building involves resistance training, proper nutrition, and recovery.'
          },
          {
            heading: 'Key Benefits',
            points: [
              'Increased strength and endurance',
              'Improved metabolism',
              'Better posture',
              'Enhanced physical appearance'
            ]
          },
          {
            heading: 'Getting Started',
            points: [
              'Start with basic strength exercises',
              'Focus on proper form',
              'Increase intensity gradually',
              'Ensure protein-rich diet'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'Consistency and proper technique are essential for effective muscle growth.'
          }
        ]
      },

      8: {
        title: 'Daily Fitness Habits',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
        sections: [
          {
            heading: 'Why Daily Habits Matter',
            text: 'Small daily actions build long-term fitness success. Consistency is the key to sustainable results.'
          },
          {
            heading: 'Healthy Daily Habits',
            points: [
              'Stay active throughout the day',
              'Drink enough water',
              'Maintain balanced meals',
              'Get enough sleep'
            ]
          },
          {
            heading: 'Things to Avoid',
            points: [
              'Skipping workouts frequently',
              'Irregular eating patterns',
              'Sedentary lifestyle',
              'Lack of discipline'
            ]
          },
          {
            heading: 'Key Takeaway',
            text: 'Small consistent habits lead to big transformations over time.'
          }
        ]
      }

    };
    this.content = data[id!];

    console.log("Loaded content:", this.content);

  }
}
