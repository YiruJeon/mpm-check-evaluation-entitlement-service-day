# 실제 근무한 기간 계산기

국가공무원의 성과평가제도에서의 **실제 근무한 기간** 계산기(성과계약등평가, 근무성적평가, 성과급평가)

평가 및 지급대상자 기준이 되는 **실제 근무한 기간**을 계산해주는 기능

# 대상자
- 성과계약등 평가: 일반직 국가공무원 4급 이상, 1년 중 **실제 근무한 기간 2개월 이상**
- 근무성적평가 :  일반직 국가공무원 5급 이하, 반기 중 실제 근무한 기간 1개월 이상
- 성과급평가 : 국가공무원, 1년 중 **실제 근무한 기간 2개월 이상**
  - 성과연봉 : 4급 이상
  - 성과상여금 : 5급 이하

# Implementation
- 바닐라 HTML, CSS, JavaScript 사용
  - 외부 JavaScript는 JQuery만 사용

# Remark
- 현재는 다음을 만족하는 경우만 사용 가능함
  - 평가기준일이 12월 31일, 즉 평가대상기간이 2022-01-01 ~ 2022-12-31
  - 토요일, 일요일, 공휴일은 근무일이 아님
  - 실제 근무한 기간 2개월 충족 여부를 확인
- HTML, CSS는 인터페이스만 담당하고 계산 기능은 전부 Javascript 구현
  - 클라이언트에서만 코드가 돌기 때문에 예외처리를 강하게 하지 않음

# Reference
- [공무원성과평가등에관한규정](https://law.go.kr/lsInfoP.do?lsiSeq=246967&lsId=009712&chrClsCd=010202&urlMode=lsInfoP&viewCls=lsInfoP&efYd=20221227&vSct=%EA%B3%B5%EB%AC%B4%EC%9B%90%EC%84%B1%EA%B3%BC%ED%8F%89%EA%B0%80&ancYnChk=0#0000)
- [공무원성과평가등에관한지침](https://law.go.kr/admRulLsInfoP.do?admRulSeq=2100000217851&vSct=%EA%B3%B5%EB%AC%B4%EC%9B%90%EC%84%B1%EA%B3%BC%ED%8F%89%EA%B0%80#AJAX)
- [공무원보수 등의 업무지침](https://law.go.kr/admRulLsInfoP.do?admRulSeq=2100000213149&vSct=%EA%B3%B5%EB%AC%B4%EC%9B%90%EB%B3%B4%EC%88%98) 중 8장 성과상여금