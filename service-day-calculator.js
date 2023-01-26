// 초기화
////////////////////////////////////////////////////////////////////////////////


$(document).ready(function () {
  prepareMap();
  calendarInit();
  update_result();
});


function prepareMap(){
  date2index = new Map()
  for(i = 0; i < 365; ++i)
    date2index[index_to_date(i)] = i
}


function calendarInit() {

  // 공무원 근무 여부 저장 배열
  service_day_array = new Array(365)
  for(i = 0; i < 365; ++i)
    service_day_array[i] = 1;

  // 휴가 사용 개수
  vacation_count = 0

  // 캘린더 렌더링
  render_calender();
}


function render_calender() {

  // 렌더링을 위한 데이터 정리
  currentYear = 2022

  // 이전년도 마지막 날짜와 요일 구하기
  var start_day = new Date(currentYear, 0, 0); // 2021-12-31
  var prev_date = start_day.getDate();
  var prev_day = start_day.getDay();

  // 렌더링 html 요소 생성
  calendar = document.getElementById("service_cal")
  calendar.innerHTML = '';

  // 지난해 및 1월 버튼
  calendar.innerHTML += '<div class="day" >1월</div>'
  calendar.innerHTML += '<div class="day disable"></div>'  // 0주차 PlaceHolder

  // 지난해 마지막 주 날짜 표기
  // prev_day: 일요일-0, 월요일-1, ..., 토요일-6
  for (var i = prev_date - prev_day; i <= prev_date; i++) {
    calendar.innerHTML += '<div class="day disable">' + i + '</div>'
  }

  // 올해
  count = prev_day;
  week_count = 0;
  cur_day = new Date(currentYear, 0, 1);
  for (ind = 0; ind < 365; ++ind) {
    count++;
    if (count % 7 == 0){
      // 월 버튼 처리
      {
        ++week_count;
        six_days_later = new Date(cur_day);
        six_days_later.setDate(six_days_later.getDate() + 6);
        // 6일 후가 다음달이거나 아니면 오늘이 1일이면 월 선택 버튼 생성
        if(six_days_later.getMonth() != cur_day.getMonth() || cur_day.getDate() == 1){
          month = six_days_later.getMonth() + 1
          calendar.innerHTML += `<div class="day" >${month}월</div>`
        }
        else
          calendar.innerHTML += '<div class="day"></div>'
      }
      // 주 버튼 처리
      calendar.innerHTML += `<div class="day" >${week_count}주차</div>`
    }

    // 일 버튼 처리
    month = cur_day.getMonth() + 1
    date = cur_day.getDate()
    if(is_holiday(cur_day))
      calendar.innerHTML += `<div id="day-${ind}" class="day holiday" >${month}. ${date}.</div>`
    else
      calendar.innerHTML += `<div id="day-${ind}" class="day" >${month}. ${date}.</div>`
    cur_day.setDate(cur_day.getDate() + 1);
  }

  // 0주차 + 52주를 하면 53주로서 중간 주가 2단문서에서 짤리기 때문에 여유 행 추가
  // 요약 : 보기 좋게 하기 위해서
  for (i = 0; i < 9; ++i)
    calendar.innerHTML += `<div class="day">&nbsp</div>`
}


// 유틸리티
////////////////////////////////////////////////////////////////////////////////


hardcoded_holiday = [
  '2022. 1. 31.', // 설날
  '2022. 2. 1.', // 설날
  '2022. 2. 2.', // 설날
  '2022. 3. 1.',
  '2022. 3. 9.', // 대통령선거일
  '2022. 5. 5.',
  '2022. 6. 1.', // 지방선거일
  '2022. 6. 6.',
  '2022. 8. 15.',
  '2022. 9. 9.', // 추석
  '2022. 9. 12.', // 추석
  '2022. 10. 3.',
  '2022. 10. 10.', // 한글날 대체공휴일
]


function is_holiday(date) {
  return hardcoded_holiday.includes(`2022. ${date.getMonth()+1}. ${date.getDate()}.`)
}

function index_to_date(index){
  return new Date(2022, 0, 1+index)
}

function date_to_index(date){
  return date2index[date]
}

// service_date가 없는 경우
// 즉 1년 내내 휴직인 경우 return 365
function find_first_service_date_index(){
  for(i = 0; i < 365; ++i){
    if(service_day_array[i] == 1)
      break;
  }
  return i;
}

// service_date가 없는 경우
// 즉 1년 내내 휴직인 경우 return -1
function find_last_service_date_index(){
  for(i = 364; i >= 0; --i){
    if(service_day_array[i] == 1)
      break
  }
  return i;
}

function is_service_date_separated(){
  first_index = find_first_service_date_index();
  last_index = find_last_service_date_index();
  for(i = first_index; i <= last_index; ++i)
    if(service_day_array[i] == 0)
      return true
  return false
}


// 결과 출력
////////////////////////////////////////////////////////////////////////////////


function update_calendar(){
  for(i = 0; i < 365; ++i){
    div_day = document.getElementById(`day-${i}`)
    if(service_day_array[i] == 0)
      div_day.style.background = 'grey';
    else
      div_day.style.background = 'white';
    div_day.style.color = '';
  }
}

function update_result(){
  result = document.getElementById("result_div")
  result.innerHTML = `휴가 ${vacation_count} 사용, `


  first_work_date_ind = find_first_service_date_index();
  last_work_date_ind = find_last_service_date_index();


  // 11월 2일 이후 출근자는 2개월 달성 불가능
  if(first_work_date_ind >= date_to_index(new Date(2022, 10, 2))){
    result.innerHTML += '<b style="color: red">실근무2개월미만</b>, 11월 2일 이후 근무시작한 직원은 2개월 이상 불가능'
    return
  }
  // 이후는 11월 1일 이전 출근자만 실행되는 코드

  // 근무기간 분리자
  if(is_service_date_separated()){
    result.innerHTML += '근무기간 분리자, 60일 충족하는지 확인, '

    cur_s_ind = first_work_date_ind
    service_count = 0;

    while(cur_s_ind <= last_work_date_ind){

      // 현재 근무일 그룹 확인
      service_day_interval_has_workingday = false
      for(ind = cur_s_ind; ind <= last_work_date_ind && service_day_array[ind] == 1; ++ind){
        cur_date = index_to_date(ind)
        if(!(cur_date.getDay() == 0 || cur_date.getDay() == 6 || is_holiday(cur_date)))
          service_day_interval_has_workingday = true
      }
      cur_e_ind = ind - 1;

      if(service_day_interval_has_workingday == true)
        service_count += cur_e_ind - cur_s_ind + 1;
      else{
        for(ind = cur_s_ind; ind <= cur_e_ind; ++ind)
          document.getElementById(`day-${ind}`).style.background = 'orange'
      }

      for(ind = cur_e_ind+1; ind <= last_work_date_ind && service_day_array[ind] == 0; ++ind) ;
      cur_s_ind = ind
    }

    if(service_count < 60 + vacation_count)
      result.innerHTML += `<b style="color: red">실근무2개월 미만, 근무일(${service_count}) - 휴가일(${vacation_count}) = ${service_count - vacation_count}</b>`
    else
      result.innerHTML += `<b style="color: blue">실근무2개월 이상, 근무일(${service_count}) - 휴가일(${vacation_count}) = ${service_count - vacation_count}</b>`
  }


  // 근무기간 미 분리자
  else{
    result.innerHTML += '근무기간 분리안됨, 역에의한 계산 사용<br>'
    two_month_later_day = index_to_date(first_work_date_ind)
    /*
      아래 코드 원래는 이렇게 짜면 안됨
      2월이 섞일 경우 절묘하게 꼬일 수 있음
      그런데 일단 평가기준일 12.31. 고정이라 아래코드로도 정상 동작
    */
    two_month_later_day.setMonth(two_month_later_day.getMonth() + 2)
    two_month_later_day.setDate(two_month_later_day.getDate() - 1)
    two_month_later_ind = date_to_index(two_month_later_day)

    if(two_month_later_ind > last_work_date_ind){
      result.innerHTML += '휴가 고려 전 이미 <b style="color: red">실근무2개월미만</b>'
      return;
    }

    str_first_service_date = index_to_date(first_work_date_ind).toLocaleDateString()
    str_twomonth_later = two_month_later_day.toLocaleDateString()

    result.innerHTML += `2개월(${str_first_service_date} ~ ${str_twomonth_later}) 근무 기준, <br>`
    result.innerHTML += `휴가일수(${vacation_count}일) 만큼 추가 출근했는지 확인 <br>`
    remaining_count = vacation_count
    for(i = two_month_later_ind + 1; remaining_count > 0 && i <= last_work_date_ind; ++i){
      // 일요일, 토요일, 공휴일 제외
      // 근무일수 세서 휴가 채우는지 본다
      cur_date = index_to_date(i)
      if(cur_date.getDay() == 0 || cur_date.getDay() == 6 || is_holiday(cur_date))
        continue;
      result.innerHTML += `- ${cur_date.toLocaleDateString()} <br>`

      document.getElementById(`day-${i}`).style.background = 'green'

      remaining_count--;
    }
    // 휴가일수를 다 못채웠으면
    if(remaining_count > 0)
      result.innerHTML += '<b style="color: red">실근무2개월 미만</b>'
    else
      result.innerHTML += '<b style="color: blue">실근무2개월 이상</b>'
  }
}




// Input Handler
////////////////////////////////////////////////////////////////////////////////


function vacation_change(value){
  vacation_count = Number(value)
  if(vacation_count < 0)
    vacation_count = 0

  update_calendar()
  update_result()
}

function period_change(){
  for(i = 0; i < 365; ++i)
    service_day_array[i] = 1;

  for(pid = 1; pid <= 8; ++pid){
    fromDom = document.getElementById(`period-from-${pid}`)
    toDom = document.getElementById(`period-to-${pid}`)

    fromDate = fromDom.valueAsDate
    toDate = toDom.valueAsDate

    if(fromDate != null && toDate != null){
      fromDate.setHours(0)
      toDate.setHours(0)

      from_day_ind = date_to_index(fromDate)
      to_day_ind = date_to_index(toDate)

      for(i = from_day_ind; i <= to_day_ind; ++i){
        service_day_array[i] = 0;
      }
    }
  }
  update_calendar()
  update_result()
}

