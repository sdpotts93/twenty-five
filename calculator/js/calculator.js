// ----------------- VARIABLES ----------------------

const form = $('.calculator-form'),
  input_wage = $('#wage').val(55),
  input_minutes_on_task = $('#minutes-on-task').val(60),
  input_task_in_day = $('#task-in-day').val(4),
  input_days_week_on_task = $('#days-week-on-task').val(5),
  input_weeks_year = $('#weeks-year').val(52),
  input_currency = form.find('.select-field'), // ad id to select

  out_year_spent = $('#year-spent'),
  out_monthly_spent = $('#monthly-spent'),

  out_15_tas = $('#15-tas'),
  out_15_tms = $('#15-tms'),
  out_15_ths = $('#15-ths'),
  out_30_tas = $('#30-tas'),
  out_30_tms = $('#30-tms'),
  out_30_ths = $('#30-ths'),
  out_60_tas = $('#60-tas'),
  out_60_tms = $('#60-tms'),
  out_60_ths = $('#60-ths'),

  out_total_h_spent = $('#total-h-spent'),
  out_annual_h_worked = $('#annual-h-worked'),
  out_save_60 = $('#save-60'),
  out_save_30 = $('#save-30'),
  out_save_15 = $('#per-15');

input_wage.attr("max", 999999999);

$.get("https://ipinfo.io", function() {}, "jsonp").then(function(resp) {
  let object = currencyArr.find(item => {
    return item.code == resp.country;
  });
  const select = document.getElementById("field");
  select.value = object.currency;
  calculate();
});

calculate();

let clickTimeout = null;

$('#weeks-year').parent().find(".form-controller.plus").addClass('disabled');

const calculatorForm = document.getElementById("email-form");

const successForm = document.querySelector(".w-form-done");

const submitButton = document.querySelector("input[type='submit']");

// ----------------- LISTENERS ----------------------

window.addEventListener('message', checkCalendlyEventScheduled, false);

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  openCalendlyWidget();

  return false;
});

$('input').on('focusin', function(){
  $(this).data('val', $(this).val());
});

$('.calculator-form .form-field').on('keyup', function() {
  let input = $(this),
    max = input.attr('max') ? input.attr('max') : 52,
    min = input.attr('min') ? input.attr('min') : 0,
    val = isNaN(parseFloat(input.val())) ? max : parseFloat(input.val());

    if ($(this).attr('id') == "minutes-on-task" || $(this).attr('id') == "task-in-day") {

      let totalMinutes = input_minutes_on_task.val() * input_task_in_day.val();

      if (totalMinutes > 1440) {
        let previousValue = $(this).data('val');
        input.val(previousValue);
      } else if (val > max) {
        input.val(max);
      } else if (val < min) {
        input.val(min);
      }

    } else {

      if (val > max) {
        input.val(max);
      } else if (val < min) {
        input.val(min);
      }
    }
});

$('.calculator-form .form-controller').on('click', function(event) {
  let input = $(this).parent().find('input'),
    val = parseFloat(input.val()),
    max = input.attr('max'),
    min = input.attr('min');

  $(this).parent().find('.form-controller').removeClass('disabled');

  $('#minutes-on-task').attr("max", "1440");
  $('#minutes-on-task').parent().children(".form-controller.plus").removeClass('disabled');
  $('#task-in-day').attr("max", "999999");
  $('#task-in-day').parent().children(".form-controller.plus").removeClass('disabled');

  if ($(this).hasClass('fc-time')) {
    if ($(this).hasClass('plus') && val < parseFloat(max)) {
      val += 15 ;
    } else if ($(this).hasClass('minus') && val > parseFloat(min)) {
      val -= 15 ;
    }
  } else {
    if ($(this).hasClass('plus') && val < max) {
      val += 1 ;
    } else if ($(this).hasClass('minus') && val > min) {
      val -= 1 ;
    }
  }

  if (val == max || val == min) {
    $(this).addClass('disabled')
  }

  let totalMinutes = $('#minutes-on-task').val() * $('#task-in-day').val();


  if (totalMinutes == 1440 && $(this).hasClass('plus')) {

    $('#minutes-on-task').parent().find(".form-controller.plus").addClass('disabled');
    $('#minutes-on-task').attr("max", $('#minutes-on-task').val());

    $('#task-in-day').parent().find(".form-controller.plus").addClass('disabled');
    $('#task-in-day').attr("max", $('#task-in-day').val());

    return;
  }

  if (totalMinutes > 1440 && $(this).hasClass('plus')) {
    $('#minutes-on-task').parent().find(".form-controller.plus").addClass('disabled');
    $('#task-in-day').parent().find(".form-controller.plus").addClass('disabled');

    let tasksInDay = $('#task-in-day').val();

    while(1440 % tasksInDay != 0) {
      tasksInDay--;
    }

    $('#task-in-day').val(tasksInDay).trigger("change");

    let minutes = 1440/tasksInDay;

    $('#minutes-on-task').val(minutes).trigger("change");

    return;
  }

  if ($(this).hasClass('fc-time') && (val - 15) < 1 && $(this).hasClass('minus')) {
    val = 1;
  }

  input.val(val).trigger('change');
});

$('.calculator-form .form-field, .calculator-form .select-field ').on('change', function(event) {
  calculate();
});

// ----------------- FUNCTIONS ----------------------

async function openCalendlyWidget(e) {

  // Open calendly widget with prefilled info from hidden fields
  Calendly.initPopupWidget({
    url: 'https://calendly.com/twenty-five/30min',
    text: 'Schedule time with me',
    color: '#0069ff',
    textColor: '#ffffff',
    branding: true
  });
}

// Listen to calendly events using message listener, it reads the
// postmessage event Calendly sends
function checkCalendlyEventScheduled(e) {
  if (isCalendlyEvent(e)) {
    if (e.data.event == "calendly.event_scheduled") {
      const calendlyCloseButton = document.querySelector(".calendly-popup-close");
      calendlyCloseButton.addEventListener("click", () => {
        window.location.href = "https://www.twenty-five.com.au/thanks-for-booking-a-call";
      });
    }
  }
}

// Check if event is coming from calendly
function isCalendlyEvent(e) {
  return e.data.event && e.data.event.indexOf('calendly') == 0;
};

function calculate() {

  let wage = parseFloat(input_wage.val()),
    hours = parseFloat(input_minutes_on_task.val())/60,
    tasks = parseFloat(input_task_in_day.val()),
    days = parseFloat(input_days_week_on_task.val()),
    weeks = parseFloat(input_weeks_year.val()),
    currency = input_currency.val();

  let totalAnnualSpend = wage * hours * tasks * days * weeks;
  let totalAnnualSaving = wage * tasks * days * weeks;
  let annualHoursSaving = tasks * days * weeks;

  out_year_spent.html(currency + ' ' + formatPrice(totalAnnualSpend) );
  out_monthly_spent.html(currency + ' ' + formatPrice(totalAnnualSpend/12) );

  out_15_tas.html(currency + ' ' + formatPrice(totalAnnualSaving * .25) );
  out_15_tms.html(currency + ' ' + formatPrice(totalAnnualSaving * .25 / 12) );
  out_15_ths.html( formatPrice(annualHoursSaving * .25) + ' h');

  out_30_tas.html(currency + ' ' + formatPrice(totalAnnualSaving * .5) );
  out_30_tms.html(currency + ' ' + formatPrice(totalAnnualSaving * .5 / 12) );
  out_30_ths.html( formatPrice(annualHoursSaving * .5) + ' h');

  out_60_tas.html(currency + ' ' + formatPrice(totalAnnualSaving) );
  out_60_tms.html(currency + ' ' + formatPrice(totalAnnualSaving) );
  out_60_ths.html( formatPrice(annualHoursSaving) + ' h');

  out_total_h_spent.html( numberFormat( hours * tasks * days ) + ' h' );
  out_annual_h_worked.html( numberFormat( hours * tasks * days * weeks ) + ' h' );

  out_save_60.html( numberFormat( (hours - 1) * tasks * days * weeks ) + ' h' );
  out_save_30.html( numberFormat( (hours - .5) * tasks * days * weeks ) + ' h' );
  out_save_15.html( numberFormat( (hours - .25) * tasks * days * weeks ) + ' h' );

};

function validateHoursTotal() {
  let minutes = parseFloat(input_minutes_on_task.val()),
    tasks = parseFloat(input_task_in_day.val());

  if (minutes * task >= 1440) {
    $(this).addClass('disabled')
  }
}

function convertToFloat(time) {
  let date = time.split(':');
  return (parseInt(date[0]) + (parseInt(date[1]) / 60)).toFixed(2) ;
}

function convertToMs(number) {

  let input = number.toString(),
    inputs = input.split("."),
    hour = inputs[0],
    minute = (parseFloat('0.'+inputs[1]) * 60) + '';

  if (minute.length < 2) {
      minute = '0' + minute;
  }
  if (hour.length < 2) {
      hour = '0' + hour;
  }

  return hour + ':' + minute;
}

function formatPrice(value) {
  let val = (value/1).toFixed(2).replace(',', '.')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

function numberFormat(value) {
  if (value < 0) {
    value = 0;
  }
  let val = (value/1).toFixed(0).replace(',', '.')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

// ----------------- CONTANTS ----------------------

let currencyArr = [
    {
        "code": "AF",
        "currency": "AFN"
    },
    {
        "code": "AX",
        "currency": "EUR"
    },
    {
        "code": "AL",
        "currency": "ALL"
    },
    {
        "code": "DZ",
        "currency": "DZD"
    },
    {
        "code": "AS",
        "currency": "USD"
    },
    {
        "code": "AD",
        "currency": "EUR"
    },
    {
        "code": "AO",
        "currency": "AOA"
    },
    {
        "code": "AI",
        "currency": "XCD"
    },
    {
        "code": "AQ",
        "currency": "XXX"
    },
    {
        "code": "AG",
        "currency": "XCD"
    },
    {
        "code": "AR",
        "currency": "ARS"
    },
    {
        "code": "AM",
        "currency": "AMD"
    },
    {
        "code": "AW",
        "currency": "AWG"
    },
    {
        "code": "AC",
        "currency": "SHP"
    },
    {
        "code": "AU",
        "currency": "AUD"
    },
    {
        "code": "AT",
        "currency": "EUR"
    },
    {
        "code": "AZ",
        "currency": "AZN"
    },
    {
        "code": "BS",
        "currency": "BSD"
    },
    {
        "code": "BH",
        "currency": "BHD"
    },
    {
        "code": "BD",
        "currency": "BDT"
    },
    {
        "code": "BB",
        "currency": "BBD"
    },
    {
        "code": "BY",
        "currency": "BYN"
    },
    {
        "code": "BE",
        "currency": "EUR"
    },
    {
        "code": "BZ",
        "currency": "BZD"
    },
    {
        "code": "BJ",
        "currency": "XOF"
    },
    {
        "code": "BM",
        "currency": "BMD"
    },
    {
        "code": "BT",
        "currency": "BTN"
    },
    {
        "code": "BO",
        "currency": "BOB"
    },
    {
        "code": "BA",
        "currency": "BAM"
    },
    {
        "code": "BW",
        "currency": "BWP"
    },
    {
        "code": "BV",
        "currency": "NOK"
    },
    {
        "code": "BR",
        "currency": "BRL"
    },
    {
        "code": "IO",
        "currency": "USD"
    },
    {
        "code": "VG",
        "currency": "USD"
    },
    {
        "code": "BN",
        "currency": "BND"
    },
    {
        "code": "BG",
        "currency": "BGN"
    },
    {
        "code": "BF",
        "currency": "XOF"
    },
    {
        "code": "BU",
        "currency": "BUK"
    },
    {
        "code": "BI",
        "currency": "BIF"
    },
    {
        "code": "KH",
        "currency": "KHR"
    },
    {
        "code": "CM",
        "currency": "XAF"
    },
    {
        "code": "CA",
        "currency": "CAD"
    },
    {
        "code": "IC",
        "currency": "EUR"
    },
    {
        "code": "CV",
        "currency": "CVE"
    },
    {
        "code": "BQ",
        "currency": "USD"
    },
    {
        "code": "KY",
        "currency": "KYD"
    },
    {
        "code": "CF",
        "currency": "XAF"
    },
    {
        "code": "EA",
        "currency": "EUR"
    },
    {
        "code": "TD",
        "currency": "XAF"
    },
    {
        "code": "CL",
        "currency": "CLP"
    },
    {
        "code": "CN",
        "currency": "CNY"
    },
    {
        "code": "CX",
        "currency": "AUD"
    },
    {
        "code": "CP",
        "currency": "XXX"
    },
    {
        "code": "CC",
        "currency": "AUD"
    },
    {
        "code": "CO",
        "currency": "COP"
    },
    {
        "code": "KM",
        "currency": "KMF"
    },
    {
        "code": "CG",
        "currency": "XAF"
    },
    {
        "code": "CD",
        "currency": "CDF"
    },
    {
        "code": "CK",
        "currency": "NZD"
    },
    {
        "code": "CR",
        "currency": "CRC"
    },
    {
        "code": "CI",
        "currency": "XOF"
    },
    {
        "code": "HR",
        "currency": "EUR"
    },
    {
        "code": "CU",
        "currency": "CUP"
    },
    {
        "code": "CW",
        "currency": "ANG"
    },
    {
        "code": "CY",
        "currency": "EUR"
    },
    {
        "code": "CZ",
        "currency": "CZK"
    },
    {
        "code": "YD",
        "currency": "YDD"
    },
    {
        "code": "DK",
        "currency": "DKK"
    },
    {
        "code": "DG",
        "currency": "USD"
    },
    {
        "code": "DJ",
        "currency": "DJF"
    },
    {
        "code": "DM",
        "currency": "XCD"
    },
    {
        "code": "DO",
        "currency": "DOP"
    },
    {
        "code": "TP",
        "currency": "TPE"
    },
    {
        "code": "EC",
        "currency": "USD"
    },
    {
        "code": "EG",
        "currency": "EGP"
    },
    {
        "code": "SV",
        "currency": "USD"
    },
    {
        "code": "GQ",
        "currency": "XAF"
    },
    {
        "code": "ER",
        "currency": "ERN"
    },
    {
        "code": "EE",
        "currency": "EUR"
    },
    {
        "code": "SZ",
        "currency": "SZL"
    },
    {
        "code": "ET",
        "currency": "ETB"
    },
    {
        "code": "FK",
        "currency": "FKP"
    },
    {
        "code": "FO",
        "currency": "DKK"
    },
    {
        "code": "FJ",
        "currency": "FJD"
    },
    {
        "code": "FI",
        "currency": "EUR"
    },
    {
        "code": "FR",
        "currency": "EUR"
    },
    {
        "code": "GF",
        "currency": "EUR"
    },
    {
        "code": "PF",
        "currency": "XPF"
    },
    {
        "code": "TF",
        "currency": "EUR"
    },
    {
        "code": "GA",
        "currency": "XAF"
    },
    {
        "code": "GM",
        "currency": "GMD"
    },
    {
        "code": "GE",
        "currency": "GEL"
    },
    {
        "code": "DD",
        "currency": "DDM"
    },
    {
        "code": "DE",
        "currency": "EUR"
    },
    {
        "code": "GH",
        "currency": "GHS"
    },
    {
        "code": "GI",
        "currency": "GIP"
    },
    {
        "code": "GR",
        "currency": "EUR"
    },
    {
        "code": "GL",
        "currency": "DKK"
    },
    {
        "code": "GD",
        "currency": "XCD"
    },
    {
        "code": "GP",
        "currency": "EUR"
    },
    {
        "code": "GU",
        "currency": "USD"
    },
    {
        "code": "GT",
        "currency": "GTQ"
    },
    {
        "code": "GG",
        "currency": "GBP"
    },
    {
        "code": "GN",
        "currency": "GNF"
    },
    {
        "code": "GW",
        "currency": "XOF"
    },
    {
        "code": "GY",
        "currency": "GYD"
    },
    {
        "code": "HT",
        "currency": "HTG"
    },
    {
        "code": "HM",
        "currency": "AUD"
    },
    {
        "code": "HN",
        "currency": "HNL"
    },
    {
        "code": "HK",
        "currency": "HKD"
    },
    {
        "code": "HU",
        "currency": "HUF"
    },
    {
        "code": "IS",
        "currency": "ISK"
    },
    {
        "code": "IN",
        "currency": "INR"
    },
    {
        "code": "ID",
        "currency": "IDR"
    },
    {
        "code": "IR",
        "currency": "IRR"
    },
    {
        "code": "IQ",
        "currency": "IQD"
    },
    {
        "code": "IE",
        "currency": "EUR"
    },
    {
        "code": "IM",
        "currency": "GBP"
    },
    {
        "code": "IL",
        "currency": "ILS"
    },
    {
        "code": "IT",
        "currency": "EUR"
    },
    {
        "code": "JM",
        "currency": "JMD"
    },
    {
        "code": "JP",
        "currency": "JPY"
    },
    {
        "code": "JE",
        "currency": "GBP"
    },
    {
        "code": "JO",
        "currency": "JOD"
    },
    {
        "code": "KZ",
        "currency": "KZT"
    },
    {
        "code": "KE",
        "currency": "KES"
    },
    {
        "code": "KI",
        "currency": "AUD"
    },
    {
        "code": "XK",
        "currency": "EUR"
    },
    {
        "code": "KW",
        "currency": "KWD"
    },
    {
        "code": "KG",
        "currency": "KGS"
    },
    {
        "code": "LA",
        "currency": "LAK"
    },
    {
        "code": "LV",
        "currency": "EUR"
    },
    {
        "code": "LB",
        "currency": "LBP"
    },
    {
        "code": "LS",
        "currency": "ZAR"
    },
    {
        "code": "LR",
        "currency": "LRD"
    },
    {
        "code": "LY",
        "currency": "LYD"
    },
    {
        "code": "LI",
        "currency": "CHF"
    },
    {
        "code": "LT",
        "currency": "EUR"
    },
    {
        "code": "LU",
        "currency": "EUR"
    },
    {
        "code": "MO",
        "currency": "MOP"
    },
    {
        "code": "MG",
        "currency": "MGA"
    },
    {
        "code": "MW",
        "currency": "MWK"
    },
    {
        "code": "MY",
        "currency": "MYR"
    },
    {
        "code": "MV",
        "currency": "MVR"
    },
    {
        "code": "ML",
        "currency": "XOF"
    },
    {
        "code": "MT",
        "currency": "EUR"
    },
    {
        "code": "MH",
        "currency": "USD"
    },
    {
        "code": "MQ",
        "currency": "EUR"
    },
    {
        "code": "MR",
        "currency": "MRU"
    },
    {
        "code": "MU",
        "currency": "MUR"
    },
    {
        "code": "YT",
        "currency": "EUR"
    },
    {
        "code": "FX",
        "currency": "na"
    },
    {
        "code": "MX",
        "currency": "MXN"
    },
    {
        "code": "FM",
        "currency": "USD"
    },
    {
        "code": "MD",
        "currency": "MDL"
    },
    {
        "code": "MC",
        "currency": "EUR"
    },
    {
        "code": "MN",
        "currency": "MNT"
    },
    {
        "code": "ME",
        "currency": "EUR"
    },
    {
        "code": "MS",
        "currency": "XCD"
    },
    {
        "code": "MA",
        "currency": "MAD"
    },
    {
        "code": "MZ",
        "currency": "MZN"
    },
    {
        "code": "MM",
        "currency": "MMK"
    },
    {
        "code": "NA",
        "currency": "NAD"
    },
    {
        "code": "NR",
        "currency": "AUD"
    },
    {
        "code": "NP",
        "currency": "NPR"
    },
    {
        "code": "NL",
        "currency": "EUR"
    },
    {
        "code": "AN",
        "currency": "na"
    },
    {
        "code": "NT",
        "currency": "na"
    },
    {
        "code": "NC",
        "currency": "XPF"
    },
    {
        "code": "NZ",
        "currency": "NZD"
    },
    {
        "code": "NI",
        "currency": "NIO"
    },
    {
        "code": "NE",
        "currency": "XOF"
    },
    {
        "code": "NG",
        "currency": "NGN"
    },
    {
        "code": "NU",
        "currency": "NZD"
    },
    {
        "code": "NF",
        "currency": "AUD"
    },
    {
        "code": "KP",
        "currency": "KPW"
    },
    {
        "code": "MK",
        "currency": "MKD"
    },
    {
        "code": "MP",
        "currency": "USD"
    },
    {
        "code": "NO",
        "currency": "NOK"
    },
    {
        "code": "OM",
        "currency": "OMR"
    },
    {
        "code": "PK",
        "currency": "PKR"
    },
    {
        "code": "PW",
        "currency": "USD"
    },
    {
        "code": "PS",
        "currency": "ILS"
    },
    {
        "code": "PA",
        "currency": "PAB"
    },
    {
        "code": "PG",
        "currency": "PGK"
    },
    {
        "code": "PY",
        "currency": "PYG"
    },
    {
        "code": "PE",
        "currency": "PEN"
    },
    {
        "code": "PH",
        "currency": "PHP"
    },
    {
        "code": "PN",
        "currency": "NZD"
    },
    {
        "code": "PL",
        "currency": "PLN"
    },
    {
        "code": "PT",
        "currency": "EUR"
    },
    {
        "code": "PR",
        "currency": "USD"
    },
    {
        "code": "QA",
        "currency": "QAR"
    },
    {
        "code": "RE",
        "currency": "EUR"
    },
    {
        "code": "RO",
        "currency": "RON"
    },
    {
        "code": "RU",
        "currency": "RUB"
    },
    {
        "code": "RW",
        "currency": "RWF"
    },
    {
        "code": "WS",
        "currency": "WST"
    },
    {
        "code": "SM",
        "currency": "EUR"
    },
    {
        "code": "ST",
        "currency": "STN"
    },
    {
        "code": "SA",
        "currency": "SAR"
    },
    {
        "code": "SN",
        "currency": "XOF"
    },
    {
        "code": "RS",
        "currency": "RSD"
    },
    {
        "code": "CS",
        "currency": "CSD"
    },
    {
        "code": "SC",
        "currency": "SCR"
    },
    {
        "code": "SL",
        "currency": "SLE"
    },
    {
        "code": "SG",
        "currency": "SGD"
    },
    {
        "code": "SX",
        "currency": "ANG"
    },
    {
        "code": "SK",
        "currency": "EUR"
    },
    {
        "code": "SI",
        "currency": "EUR"
    },
    {
        "code": "SB",
        "currency": "SBD"
    },
    {
        "code": "SO",
        "currency": "SOS"
    },
    {
        "code": "ZA",
        "currency": "ZAR"
    },
    {
        "code": "GS",
        "currency": "GBP"
    },
    {
        "code": "KR",
        "currency": "KRW"
    },
    {
        "code": "SS",
        "currency": "SSP"
    },
    {
        "code": "ES",
        "currency": "EUR"
    },
    {
        "code": "LK",
        "currency": "LKR"
    },
    {
        "code": "BL",
        "currency": "EUR"
    },
    {
        "code": "SH",
        "currency": "SHP"
    },
    {
        "code": "KN",
        "currency": "XCD"
    },
    {
        "code": "LC",
        "currency": "XCD"
    },
    {
        "code": "MF",
        "currency": "EUR"
    },
    {
        "code": "PM",
        "currency": "EUR"
    },
    {
        "code": "VC",
        "currency": "XCD"
    },
    {
        "code": "SD",
        "currency": "SDG"
    },
    {
        "code": "SR",
        "currency": "SRD"
    },
    {
        "code": "SJ",
        "currency": "NOK"
    },
    {
        "code": "SE",
        "currency": "SEK"
    },
    {
        "code": "CH",
        "currency": "CHF"
    },
    {
        "code": "SY",
        "currency": "SYP"
    },
    {
        "code": "TW",
        "currency": "TWD"
    },
    {
        "code": "TJ",
        "currency": "TJS"
    },
    {
        "code": "TZ",
        "currency": "TZS"
    },
    {
        "code": "TH",
        "currency": "THB"
    },
    {
        "code": "TL",
        "currency": "USD"
    },
    {
        "code": "TG",
        "currency": "XOF"
    },
    {
        "code": "TK",
        "currency": "NZD"
    },
    {
        "code": "TO",
        "currency": "TOP"
    },
    {
        "code": "TT",
        "currency": "TTD"
    },
    {
        "code": "TA",
        "currency": "GBP"
    },
    {
        "code": "TN",
        "currency": "TND"
    },
    {
        "code": "TR",
        "currency": "TRY"
    },
    {
        "code": "TM",
        "currency": "TMT"
    },
    {
        "code": "TC",
        "currency": "USD"
    },
    {
        "code": "TV",
        "currency": "AUD"
    },
    {
        "code": "UM",
        "currency": "USD"
    },
    {
        "code": "VI",
        "currency": "USD"
    },
    {
        "code": "UG",
        "currency": "UGX"
    },
    {
        "code": "UA",
        "currency": "UAH"
    },
    {
        "code": "SU",
        "currency": "SUR"
    },
    {
        "code": "AE",
        "currency": "AED"
    },
    {
        "code": "GB",
        "currency": "GBP"
    },
    {
        "code": "US",
        "currency": "USD"
    },
    {
        "code": "UY",
        "currency": "UYU"
    },
    {
        "code": "UZ",
        "currency": "UZS"
    },
    {
        "code": "VU",
        "currency": "VUV"
    },
    {
        "code": "VA",
        "currency": "EUR"
    },
    {
        "code": "VE",
        "currency": "VES"
    },
    {
        "code": "VN",
        "currency": "VND"
    },
    {
        "code": "WF",
        "currency": "XPF"
    },
    {
        "code": "EH",
        "currency": "MAD"
    },
    {
        "code": "YE",
        "currency": "YER"
    },
    {
        "code": "YU",
        "currency": "YUM"
    },
    {
        "code": "ZR",
        "currency": "ZRN"
    },
    {
        "code": "ZM",
        "currency": "ZMW"
    },
    {
        "code": "ZW",
        "currency": "USD"
    }
]
