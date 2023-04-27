const Age_calculator = {
  init: function(){
    this.cache_selectors()
    this.bind_events()
  },

  cache_selectors: function(){
    //Form elements
    this.$birth_date_form = document.querySelector('#birth_date_form')

    //day
    this.$label_day = document.querySelector('#label_day')
    this.$input_day = document.querySelector('#input_day')
    this.$error_day = document.querySelector('#error_day')

    //month
    this.$label_month = document.querySelector('#label_month')
    this.$input_month = document.querySelector('#input_month')
    this.$error_month = document.querySelector('#error_month')

    //year
    this.$label_year = document.querySelector('#label_year')
    this.$input_year = document.querySelector('#input_year')
    this.$error_year = document.querySelector('#error_year')

    //Result elements
    this.$age_years = document.querySelector('#age_years')
    this.$age_months = document.querySelector('#age_months')
    this.$age_days = document.querySelector('#age_days')
  },

  bind_events: function(){

    //tests
    const today = this.Get.today()
    const start = new Date(1989, 03, 26)

    this.timeEllapsedlBetweenDates(start, today)
    try{
      const inputDay = this.Get.inputValue(this.$inputs[0])
      const inputMonth = this.Get.inputValue(this.$inputs[1])
      const inputYear = this.Get.inputValue(this.$inputs[2])
      console.log(inputDay, inputMonth, inputYear)
    }catch(err){
      console.log(err)
    }
  },

  /**
   * Receives the initial and final date between an interval
   * Returns the total time ellapsed in years, months and days
   * @param {Date} fullStartDate The initial date of the interval
   * @param {Date} fullEndDate The final date of the interval
   * @returns {Object} An Object containing the number of years, months and days of the interval
   */
  timeEllapsedlBetweenDates: function(fullStartDate, fullEndDate){

    const millisInterval = this.millisBetweenDates(fullStartDate, fullEndDate)
    const daysInterval = this.millisToDays(millisInterval)
    const startYear = this.Get.year(fullStartDate)
    const endYear = this.Get.year(fullEndDate)
    const startMonth = this.Get.month(fullStartDate)

    const{remainingDaysFromYears, totalYears} = this.yearsFromDays(startYear, daysInterval)
    const{remainingDaysFromMonths, totalMonths} = this.monthsFromDays(endYear, startMonth, remainingDaysFromYears)

    return{totalYears, totalMonths, remainingDaysFromMonths}
  },

  /**
     * Receives the start and end dates, returning the milliseconds elapsed between them
     * @param {Date} fullStartDate Object Date representing the start date
     * @param {Date} fullEndDate Object Date representing the end date
     * @returns {millis} Milliseconds between start and end dates
     */
  millisBetweenDates: function (fullStartDate, fullEndDate){
    return fullEndDate.getTime() - fullStartDate.getTime()
  },

  /**
   * Receives a number representing an interval in millis and 
   * return a number representing an interval in days
   * @param {Number} millis The number in milliseconds to transform in days
   * @returns {Number} The number of days 
   */
  millisToDays: function(millis){

    const index = (
      this.Params.indexMillisToSecs *
      this.Params.indexSecsToMins * 
      this.Params.indexMinsToHrs *
      this.Params.indexHrsToDays
    )
    return Math.floor(millis/index)
  },

  /**
   * Receives an initial year and an interval of days, returning an 
   * Object containing the number of years ellapsed since the initial year
   * And the remaining days
   * @param {Number} startYear The 4 digit number representing the initial year
   * @param {Number} daysInterval The number of days in an interval between dates
   * @returns {Object} An object containg the number of remining days and the total number of years of the interval
   */
  yearsFromDays: function(startYear, daysInterval){

    let daysOfCurrentYear = this.daysOfYear(startYear)
    let remainingDaysFromYears = daysInterval
    let totalYears = 0

    for(totalYears; remainingDaysFromYears >= daysOfCurrentYear; totalYears++){

      daysOfCurrentYear = this.daysOfYear(startYear+totalYears)
      remainingDaysFromYears -= daysOfCurrentYear
    }

    return{remainingDaysFromYears, totalYears}
  },

  /**
   * Must be used when the interval of days is lesser than one current year
   * Receives the actual year, the initial month of the interval and the interval of days
   * Return an object containing the remainig days and the total number of months ellapsed in the interval
   * @param {Number} actualYear The 4 digit year represnting the actual year
   * @param {Number} startMonth The number from 0 to 11 representing the initial month
   * @param {Number} daysInterval The number of days of the interval
   * @returns {Object} An object containing the remaining days ant the total months of the interval
   */
  monthsFromDays: function(actualYear, startMonth, daysInterval){

    let daysOfCurrentMonth = this.daysOfMonth(actualYear, startMonth)
    let remainingDaysFromMonths = daysInterval
    let totalMonths = 0

    for(totalMonths; remainingDaysFromMonths >= daysOfCurrentMonth; totalMonths++){
      daysOfCurrentMonth = this.daysOfMonth(actualYear, (startMonth + totalMonths))
      remainingDaysFromMonths -= daysOfCurrentMonth
    }

    return {remainingDaysFromMonths, totalMonths}
  },

  /**
   * Receive a year and returns the number of days of that year
   * @param {Number} year The 4 digit number representing an year
   * @returns {Number} The number of days on the informed year
   */
  daysOfYear: function(year){
    return this.isLeapYear(year) == true ? 366 : 365
  },

  /**
   * Based on the month and it's respective year return the number of days of the informed month
   * @param {Number} year The 4 digit number representing the year of the month
   * @param {Number} month The number from 0 to 11 representing the month
   * @returns {Number} The number of days of the informed month
   */
  daysOfMonth: function(year, month){
    switch (month){
      case 0:
        return 31
      case 1:
        if (this.isLeapYear(year)){ return 29 }
        return 28
      case 2:
        return 31
      case 3:
        return 30
      case 4:
        return 31
      case 5:
        return 31
      case 6:
        return 31
      case 7:
        return 31
      case 8:
        return 30
      case 9:
        return 31
      case 10:
        return 30
      case 11:
        return 31
      default:
        return
    }

  },

  /**
   * Receives an year an returns true if is a Leap year, othwerwise returns false
   * @param {Number} year The 4 digit number representing an year
   * @returns {boolean} True is is Leap year, otherwise, returns false
   */
  isLeapYear: function(year){
    if((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)){
      return true
    }
    return false
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
    },

    /**
     * Receives the address of the input element and returns it's value
     * Throws required error
     * @param {*} inputField The address of the element
     * @returns {*} The value in the input field
     * @throws {Error} Required field message error
     */
    inputValue: function(inputField){
      if(inputField.value){
        return inputField.value
      }
      throw this.Messages.required
    },

    inputDay: function(){
      
    },

    Messages: {
      required: 'This field is required',
      invalidDay: 'Must be a valid day',
      invalidMonth: 'Must be a valid month',
      invalidYear: 'Must be in the past',
    },

    Regx : {
      /** Regular Expression matching years of 4 digits
        * min 1 digit max 4 digit
      */
      year: /\d{1,4}/,

      /** Regular Expression matching months from 1 to 12
        * starting with 1 to 9 end 
        * | starting with 1 and 0 to 2 end
      */
      month:/^[1-9]$|^1[0-2]$/,

      /** Regular Expression matching days from 1 to 31
       * starting with 1 to 9 end
       * | starting with 1 to 2 and 0 to 9 end
       * | starting with 3 and 0 to 1 end
       */
      day: /^[1-9]$|^[1-2][0-9]$|^3[0-1]$/,
    }

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