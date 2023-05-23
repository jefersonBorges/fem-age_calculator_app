const ageCalculator = {

  init() {
    this.cacheSelectors()
    this.bindEvents()
  },

  cacheSelectors() {
    this.$dateForm = document.querySelector('#date_form')
    this.$ageYears = document.querySelector('#age_years')
    this.$ageMonths = document.querySelector('#age_months')
    this.$ageDays = document.querySelector('#age_days')
  },

  bindEvents() {
    this.$dateForm.onsubmit = this.Events.calculateAge.bind(this)
  },

  Events: {

    calculateAge(e) {
      e.preventDefault()
      this.errorRemoveAll(e)

      const year = this.getYearValue(e)
      const month = this.getMonthValue(e)
      const day = this.getDayValue(e, year, month)

      if(year && month && day) {

        const inputDateValue = this.getNewDate(year, month, day)
        const currentDate = this.getNewDate()

        const age = this.Calculate.ageBetweenDates(inputDateValue, currentDate)

        this.displayAge(age)
      }

    },
    
  },

  getYearValue(e) {

    const yearInputElement = e.target.elements.year
    const inputNotEmpty = yearInputElement.value !== ''

    try {
      
      if(inputNotEmpty) {

        const currentYear = this.getNewDate().getFullYear()
        const isInThePast = yearInputElement.value <= currentYear

        if(isInThePast) {

          const inputYearValue = parseInt(yearInputElement.value)
          const isFourDigits = this.regex.year.test(inputYearValue)

          if(isFourDigits) {

            return inputYearValue

          } else { throw this.Error.invalidYearDigits }

        } else { throw this.Error.invalidYear }

      } else { throw this.Error.required }

    } catch(err) { this.errorDisplay(yearInputElement, err.message) }

  },

  getMonthValue(e) {

    const monthInputElement = e.target.elements.month
    const inputNotEmpty = monthInputElement.value !== ''

    try{

      if(inputNotEmpty) {

        const inputMonthValue = parseInt(monthInputElement.value - 1)
        const isValidMonth = this.regex.month.test(inputMonthValue)

        if(isValidMonth) {

          return inputMonthValue

        } else { throw this.Error.invalidMonth }

      } else { throw this.Error.required }
      
    } catch(err) { this.errorDisplay(monthInputElement, err.message) }
  },

  getDayValue(e, year, month) {

    const dayInputElement = e.target.elements.day
    const inputNotEmpty = dayInputElement.value !== ''

    try{

      if(inputNotEmpty) {
        
        const dayValue = parseInt(dayInputElement.value)
        const daysOfMonth = this.Calculate.daysOfMonth(year, month)

        const isCorrectValue = this.regex.day.test(dayValue)

        if(isCorrectValue) {
          const isWithinTheMonth = dayValue <= daysOfMonth

          if(isWithinTheMonth) {

            return dayValue

          } else { throw this.Error.invalidDate }

        } else { throw this.Error.invalidDay }

      } else { throw this.Error.required }

    } catch(err) { this.errorDisplay(dayInputElement, err.message) }
    
  },

  getNewDate(year, month, day) {
    const date = new Date()

    if(year && month && day) { 
      date.setFullYear(year, month, day) 
    }

    date.setHours(00,00,00)
    return date
  },

  displayAge(age) {
    const delay = 60
    
    this.incrementWithDelay(this.$ageYears, age.totalYears, delay)
    this.incrementWithDelay(this.$ageMonths, age.totalMonths, delay)
    this.incrementWithDelay(this.$ageDays, age.totalDays, delay)
  },

  incrementWithDelay(element, endValue, delay) {

    element.innerText = 0
    const increment = 1
    let currentValue = parseInt(element.innerText)

    const intervalId = setInterval( ()=>{

      if(currentValue >= endValue) {
        clearInterval(intervalId)
        return
      }

      currentValue += increment
      element.innerText = currentValue

    }, delay)

  },

  Calculate: {

    ageBetweenDates(startDate, endDate) {
      const startYear = startDate.getFullYear()
      const startMonth = startDate.getMonth()

      const millisInterval = this.millisBetweenDates(startDate, endDate)
      const daysInterval = this.millisToDays(millisInterval)

      const { totalYears, daysLeft } = this.daysToYears(daysInterval, startYear)
      const { totalMonths, totalDays } = this.daysToMonths(daysLeft, startMonth, startYear)
      
      return { totalYears, totalMonths, totalDays }
    },

    millisBetweenDates(startDate, endDate) {
      return endDate.getTime() - startDate.getTime()
    },

    millisToDays(millis) {
      return Math.round(
        millis /
        this.index.millisToSecs /
        this.index.secsToMins /
        this.index.minsToHrs /
        this.index.hrsToDays
      )
    },

    daysToYears(days, startYear) {
      let totalYears = 0
      let daysLeft = days
      let daysOfYear = this.daysOfYear(startYear)

      while(daysLeft > daysOfYear) {

        daysLeft -= daysOfYear
        totalYears++
        daysOfYear = this.daysOfYear(startYear + totalYears)
      }

      return { totalYears, daysLeft }
    },

    daysToMonths(days, startMonth, startYear) {
      let totalMonths = 0
      let totalDays = days
      let daysOfMonth = this.daysOfMonth(startYear, startMonth)

      while(totalDays > daysOfMonth) {

        totalDays -= daysOfMonth
        totalMonths++
        daysOfMonth = this.daysOfMonth(startYear, startMonth + totalMonths)
      }

      return { totalMonths, totalDays }
    },

    daysOfMonth(year, month) {
      return new Date(year, month + 1, 0).getDate()
    },

    daysOfYear(year) {
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

  errorDisplay(inputElement, errMsg) {
    const element = inputElement.parentElement.children

    for(el of element) {

      if(el.className === "message") {
        el.innerText = errMsg
      }

      el.classList.add("error")
    }
  },

  errorRemove(inputElement){
    const element = inputElement.parentElement.children

    for(el of element){

      if(el.className === "message") {
        el.innerText = ''
      }

      el.classList.remove("error")
    }
  },

  errorRemoveAll(e) {
    this.errorRemove(e.target.elements.year)
    this.errorRemove(e.target.elements.month)
    this.errorRemove(e.target.elements.day)
  },

  Error: {

    required: {
      name: "required",
      message : "This field is required",
    },

    invalidDay: {
      name: "invalidDay",
      message: "Must be a valid day",
    },

    invalidDate: {
      name: "invalidDate",
      message: "Must be a valid date",
    },

    invalidMonth: {
      name: "invalidMonth",
      message: "Must be a valid month",
    },

    invalidYear: {
      name: "invalidYear",
      message: "Must be in the past",
    },

    invalidYearDigits: {
      name: "invalidYearDigits",
      message: "Must be a 4 digit year",
    },

  },

  regex: {
    day: /^[1-9]$|^[1-2][0-9]$|^3[0-1]$/,
    month: /^[0-9]$|^1[0-1]$/,
    year: /\d{4}/,
  },

}

ageCalculator.init()