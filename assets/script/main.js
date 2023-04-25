const Age_calculator = {
  init: function(){
    this.cache_selectors()
    this.bind_events()
  },

  cache_selectors: function(){
    this.$birth_date_form = document.querySelector('#birth_date_form')
    this.$form_sections = document.querySelectorAll('.form-section')
    this.$labels = document.querySelectorAll('.label')
    this.$inputs = document.querySelectorAll('.input')
    this.$error_messages = document.querySelectorAll('.error-message')
    this.$age_years = document.querySelector('#age_years')
    this.$age_months = document.querySelector('#age_months')
    this.$age_days = document.querySelector('#age_days')
  },

  bind_events: function(){
    const today = this.Get.today()
    const day = this.Get.day(today)
    const month = this.Get.month(today)
    const year = this.Get.year(today)

    console.log(new Date(year, month, day))
  },

  Calculate: {

    /**
     * Receives the start and end dates, returning the milliseconds elapsed between them
     * @param {Date} fullStartDate Object Date representing the start date
     * @param {Date} fullEndDate Object Date representing the end date
     * @returns {millis} Milliseconds between start and end dates
     */
    intervalBetweenDates: function (fullStartDate, fullEndDate){
      return fullEndDate - fullStartDate
    },

    /*
    millisToDays: function (millis){

    }*/
  },

  Get: {
    /**
     * Return the Date object representing today
     * @returns {Date} Date object representing the actual date
     */
    today: function(){
      return new Date()
    },
  
    /**
     * Receives a date object and return the day of the month
     * @param {Date} fulldate Date object
     * @returns {Number}  from 1 to 31
     */
    day: function(fulldate){
      return fulldate.getDate()
    },

    /**
     * Receives a date object and return the number of the month 
     * @param {Date} fulldate Date object
     * @returns {Number} from 0(January) to 11(December)
     */
    month: function(fulldate){
      return fulldate.getMonth()
    },

    /**
     * Receives a date object and return the year 
     * @param {Date} fulldate Date object
     * @returns {Number} 4 digit year
     */
    year: function(fulldate){
      return fulldate.getFullYear()
    },

    /**
     * Receives year, month and day and return the Date object representing it
     * @param {Number} year The 4 digit year
     * @param {Number} month The number of the month, from 0 to 11
     * @param {Number} day The 2 digit day of the month, from 1 to 31
     * @returns {Date} the Date object representing the formated day 
     */
    formattedDate: function(year, month, day){
      return new Date(year, month, day)
    }

  },


  Messages: {
    required: 'This field is required',
    invalidDay: 'Must be a valid day',
    invalidMonth: 'Must be a valid month',
    invalidYear: 'Must be in the past',
  },

  Params: {
    transitionTime: 1000,
    indexMillisToSecs: 1000,
    indexSecsToMins: 60,
    indexMinsToHrs: 60,
    indexHrsToDays: 24,
  }
}

Age_calculator.init()

/**
 * Get the actual day
 * Get the values from the inputs
 *  Check for errors
 * Calculate the interval between dates ?
 */