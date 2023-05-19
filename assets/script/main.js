const ageCalculator = {
  init: function(){
    this.cacheSelectors()
    this.bindEvents()
  },

  cacheSelectors: function(){
    this.$date_form = document.querySelector('#date_form')
    this.$age_years = document.querySelector('#age_years')
    this.$age_months = document.querySelector('#age_months')
    this.$age_days = document.querySelector('#age_days')
  },

  bindEvents: function(){
    this.$date_form.onsubmit = this.Events.calculateAge.bind(this)
  },

  Events:{

    calculateAge : function(e){
      e.preventDefault()
      this.Error.removeAll(e)

      const currentDate = this.newDate()
      const currentYear = newDate.getFullYear()
      const currentMonth = newDate.getMonth()
      const currentDay = currentDate.getDate()

      const year = this.getInputYear(e.target.elements.year, currentYear)
      const month = this.getInputMonth(e.target.elements.month)
      const day = this.getInputDay(e.target.elements.day, month, year)

      if(year, month, day){
        const inputDate = this.newDate(year, month, day)

        const age = this.Calculate.ageBetweenDates(inputDate, currentDate)
        this.displayAge(age)
      }
    },
    
  },

  getInputYear(inputElement, currentYear){
    try{
      const year = this.Validate.input(inputElement)
      return this.Validate.year(year, currentYear)

    } catch(err) {
      this.Error.display(inputElement, err)
    }
  },

  getInputMonth(inputElement){
    try{
      const month = this.Validate.input(inputElement)
      return this.Validate.month(month)

    } catch(err){
      this.Error.display(inputElement, err)
    }
  },

  getInputDay(dayInputElement, month, year){
    try{
      const day = this.Validate.input(dayInputElement)
      return this.Validate.day(day, month, year)

    } catch(err){
      this.Error.display(dayInputElement, err)
    }
    
  },

  displayAge: function(age){
    const delay = 60

    this.incrementWithDelay(this.$age_years, age.totalYears, delay)
    this.incrementWithDelay(this.$age_months, age.totalMonths, delay)
    this.incrementWithDelay(this.$age_days, age.totalDays, delay)
  },

  incrementWithDelay: function(element, endValue, delay){
    element.innerText = 00
    let currentValue = parseInt(element.innerText)
    let increment = 1

    const intervalId = setInterval(()=>{

      if(currentValue >= endValue){
        clearInterval(intervalId)
        return
      }

      currentValue += increment
      element.innerText = currentValue
    }, delay)

  },


  newDate: function(year, month, day){
    const date = new Date()

    if(year && month && day){ 
      date.setFullYear(year, month, day) 
    }

    return date
  },

  Calculate: {

    ageBetweenDates: function(startDate, endDate){
      const startYear = startDate.getFullYear()
      const startMonth = startDate.getMonth()

      const millis = this.millisBetweenDates(startDate, endDate)
      const days = this.millisToDays(millis)
      const years = this.daysToYears(days, startYear)
      const months = this.daysToMonths(years.daysLeft, startMonth, startYear)
      
      const age  = {
        totalYears : Math.round(years.totalYears),
        totalMonths: Math.round(months.totalMonths),
        totalDays: Math.round(months.daysLeft)
      }

      return age
    },

    millisBetweenDates: function(startDate, endDate){

      startDate.setHours(00,00,00)
      endDate.setHours(00,00,00)

      return endDate.getTime() - startDate.getTime()
    },

    millisToDays: function(millis){
      return Math.round(
        millis /
        this.index.millisToSecs /
        this.index.secsToMins /
        this.index.minsToHrs /
        this.index.hrsToDays
      )
    },

    daysToYears: function(days, startYear){
      let totalYears = 0
      let daysLeft = days
      let daysOfYear = this.daysOfYear(startYear)

      while(daysLeft > daysOfYear){

        daysLeft -= daysOfYear
        totalYears++
        daysOfYear = this.daysOfYear(startYear + totalYears)
      }

      return {totalYears, daysLeft}
    },

    daysToMonths: function(days, startMonth, startYear){
      let totalMonths = 0
      let daysLeft = days
      let daysOfMonth = this.daysOfMonth(startYear, startMonth)

      while(daysLeft > daysOfMonth){

        daysLeft -= daysOfMonth
        totalMonths++
        daysOfMonth = this.daysOfMonth(startYear, startMonth + totalMonths)
      }

      return {totalMonths, daysLeft}
    },


    daysOfMonth: function(year, month){
      return new Date(year, month + 1, 0).getDate()
    },

    daysOfYear: function(year){
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
      return isLeapYear ? 366 : 365
    },

    index: {
      millisToSecs: 1000,
      secsToMins: 60,
      minsToHrs: 60,
      hrsToDays: 24,
    },
  },

  Validate: {

    input: function(inputElement){

      if(inputElement.value){
        return parseInt(inputElement.value)
      }
      throw this.msg.required
    },

    year: function(yearValue, currentYear){

      if(this.regex.year.test(yearValue)){

        if(yearValue < currentYear){
          return yearValue

        } else { throw this.msg.invalid_year }

      } else { throw this.msg.invalid_year_digits }
      
    },

    month: function(monthValue){
      const month = monthValue - 1
      
      if(this.regex.month.test(month)){
        return month
      }

      throw this.msg.invalid_month
    },

    day: function(dayValue, monthValue, yearValue){

      const daysInMonth = this.daysOfMonth(yearValue, monthValue)

      if(this.regex.day.test(dayValue) && dayValue <= daysInMonth){
        return dayValue
      }

      throw this.msg.invalid_day
    },

    daysOfMonth: function(year, month){
      return new Date(year, month + 1, 0).getDate()
    },

    regex: {
      day: /^[1-9]$|^[1-2][0-9]$|^3[0-1]$/,
      month: /^[0-9]$|^1[0-1]$/,
      year: /\d{4}/,
    },

    msg: {
      required: "This field is required",
      invalid_day: "Must be a valid day",
      invalid_month: "Must be a valid month",
      invalid_year: "Must be in the past",
      invalid_year_digits: "Must be a 4 digit year"
    },

  },

  Error: {

    display: function(inputElement, errMsg){
      const element = inputElement.parentElement.children

      for(el of element){

        if(el.className == this.class.errDisplay){
          el.innerText = errMsg
        }

        el.classList.add(this.class.errStyle)
      }
    },

    remove: function(inputElement){
      const element = inputElement.parentElement.children

      for(el of element){

        if(el.className == this.class.errDisplay){
          el.innerText = this.msg.empty
        }

        el.classList.remove(this.class.errStyle)
      }
    },

    removeAll: function(e){
      this.remove(e.target.elements.year)
      this.remove(e.target.elements.month)
      this.remove(e.target.elements.day)
    },

    class:{
      errDisplay: "message",
      errStyle: "error",
    },

    msg: {
      empty: "",
    }
    
  },

}

ageCalculator.init()