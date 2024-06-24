
/**
 * 학생 목록 테이블 출력
 * @param {*} students  
 */
const renderingStudents = function (students) {
  const tbody = document.querySelector("#studentList");
  const tfoot = document.querySelector("#tfootscores");
  let trs = "";
  let tfcontents = "";
  
  students.forEach(student => {
    trs += `
      <tr>
        <th>${student.ssn}</th>
        <td>${student.name}</td>
        <td>${student.korean}</td>
        <td>${student.english}</td>
        <td>${student.math}</td>
        <td>${student.getSum()}</td>
        <td>${student.getAverage()}</td>
   
      </tr>
    `;
  });

  tbody.innerHTML = trs;

  let totalSum = null;
  students.forEach(student => {totalSum += student.getSum();})

  let totalAverage = 0.0;
  students.forEach(student =>{totalAverage = ((totalSum / 3) / students.length).toFixed(1); })


  tfcontents = `
      <tr>
        <th></th>
        <th scope="col" colspan="4">총  계</th>
        <td>${totalSum} </td>
        <td>${totalAverage}</td>
  
      </tr>
      `
      tfoot.innerHTML = tfcontents;



  
}

// const totalScore = function(){
//   const total = getSum(students.getSum);
//   renderingStudents(total);
// }



// 학생등록 !!!!!!!!!!! 같은 번호 등록불가 해야됌
const createStudent = function (studentService) {
  const ssn = document.studentForm.ssn.value;
  const name = document.studentForm.name.value;
  const korean = document.studentForm.korean.value;
  const english = document.studentForm.english.value;
  const math = document.studentForm.math.value;

  // 입력 데이터 데이터 유효성 검증
  if (Validator.isEmpty(ssn) || !Validator.isNumber(ssn)) {
    alert("학번을 입력해주세요");
    document.studentForm.ssn.value = "";
    document.studentForm.ssn.focus();
    return;
  }

  
  if (Validator.isEmpty(name) || !Validator.isName(name)) {
    alert("이름을 입력해주세요");
    document.studentForm.name.value = "";
    document.studentForm.name.focus();
    return;
  }

  if (Validator.isEmpty(korean) || !Validator.isNumber(korean)) {
    alert("숫자를 입력해주세요");
    document.studentForm.korean.value = "";
    document.studentForm.korean.focus();
    return;
  }

  if (Validator.isEmpty(english) || !Validator.isNumber(english)) {
    alert("숫자를 입력해주세요");
    document.studentForm.english.value = "";
    document.studentForm.english.focus();
    return;
  }

  if (Validator.isEmpty(math) || !Validator.isNumber(math)) {
    alert("숫자를 입력해주세요");
    document.studentForm.math.value = "";
    document.studentForm.math.focus();
    return;
  }

  // studentService 객체에 신규 학생 등록
  studentService.addStudent(new Student(ssn, name, parseInt(korean), parseInt(english), parseInt(math)));
  inputFieldReset();
  
  // 학생 등록 완료 후 전체 목록 반환 후 출력
  const students = studentService.findAll();
  renderingStudents(students);
  showMessageModal("등록 결과", "정상 등록 처리되었습니다.");
}


const cancelStudent = function (studentService) {
  inputFieldReset();
}

// input 필드 초기화
const inputFieldReset = function () {
  const fields = document.querySelectorAll("input[type='text']");
  fields.forEach((field) => {
    field.value = "";
  })
}

// 정렬
const sortStudents = function (studentService, sortType) {
  const students = studentService.findAll();
  switch (sortType) {
    case "ssn":
      students.sort((student1, student2) => parseInt(student1.ssn) - parseInt(student2.ssn));
      break;
    case "name": 
      students.sort((student1, student2) => student1.name.charCodeAt(0) - student2.name.charCodeAt(0));
      break;
    case "sum":
      students.sort((student1, student2) => student2.getSum() - student1.getSum());
      break;
  }
  renderingStudents(students);
}

// Sweet Alert2 메세지 창
const showMessageModal = function(title, text){
  Swal.fire({
    title: title,
    text: text,
    icon: "success"
  });
}

const showErrorModal = function(title, text){
  Swal.fire({
    title: title,
    text: text,
    icon: "error"
  });
}


//검색 
const findStudent = function(students){
  const searchSelect = document.querySelector("select[name=searchOptions]");
  const searchText = document.querySelector("input[name=searchBar]");
  const findButton = document.querySelector("button[name=find]");

  findButton.addEventListener("click", event =>{
    event.preventDefault();

    let findStudents = [];

    // if (findStudents.length === 0 ){
    //   showMessageModal("검색실패","검색어를 입력해주세요.");
    //   return;
    // }

 

    switch(searchSelect.value){

      case "select" : 
      if (searchText.value.trim() === "" ) {
        renderingStudents(students);
        return;
      }
      break;

      case "findSsn" :
        if (searchText.value.trim() === "" ) {
          renderingStudents(students);
          return;
        }
            
      findStudents = students.filter(student => student.ssn === searchText.value);

        console.log(findStudents);
        break;

        case "findName" :
          if (searchText.value.trim() === "" ) {
            renderingStudents(students);
            return;
          }
    
          findStudents = students.filter(student => student.name === searchText.value);
          console.log(findStudents);

          break;
    }
 

    renderingStudents(findStudents);
  });
  

}

// 학생 삭제
const removeStudent = function(studentService){
  const students = studentService.findAll();
  const ssnInput = document.querySelector("input[name=ssn]").value;
  const nameInput = document.querySelector("input[name=name]").value;

  for (let i = 0; i < students.length; i++){
    if(ssnInput == students[i].ssn && nameInput ==students[i].name){
      students.splice(i,1);
      showMessageModal("삭제완료", i.ssn +"번 학생정보가 삭제되었습니다")    
      renderingStudents(students);
      inputFieldReset();
      return;
    } else{
      showErrorModal("삭제실패","일치하는 학생 정보가 없습니다")
      inputFieldReset();
    }
  }
}



/**
 * 이벤트타겟에 이벤트핸들러 등록
 */
const eventRegister = function () {
  // 학생 성적 관리 서비스 객체
  let studentService = null;
  // 문서 로드이벤트 처리
  window.addEventListener("load", function () {
    studentService = new StudentService();
    // 더미데이터 학생 등록
    const student = new Student('10', '바나나', 100, 90, 80);
    studentService.addStudent(student);
    studentService.addStudent(new Student('11', '라봉', 100, 100, 100));
    studentService.addStudent(new Student('12', '사파이어', 90, 90, 90));
    studentService.addStudent(new Student('13', '레몬', 80, 80, 80));
    //학생 전체 목록
    const students = studentService.findAll();
    renderingStudents(students);
    // allList.forEach((student) => console.log(student.toString())); -콘솔출력시
    findStudent(students);
  });

  // 학생 등록 이벤트 처리
  document.querySelector("#addButton").addEventListener("click", (event) => {
    createStudent(studentService);
  });

  // 학생 등록 리셋 이벤트 처리
  document.querySelector("#resetButton").addEventListener("click", (event) =>{
    cancelStudent(studentService);
  });

  // 정렬 이벤트 처리
  document.studentForm.sortType.addEventListener("change", function (event) {
    if (this.selectedIndex == 0) {
      return;
    }
    const searchType = this.options[this.selectedIndex].value;
    sortStudents(studentService, searchType);
  });

  //삭제 이벤트 처리

  document.querySelector("#cancelButton").addEventListener("click", (event) => {
    removeStudent(studentService); });


    

  







  // document.querySelector("#searchButton").addEventListener("click", (event) =>{
  //   searchElement(studentService);
  // });

  // document.addEventListener("DOMContentLoaded", function() {
  //   let dropdown = document.querySelector("#searchOptions");
  //   let studentList = document.querySelector("#studentList");
  
  //   dropdown.addEventListener("change", function() {
  //     let selectedValue = dropdown.value;
  //     let selectedText = dropdown.options[dropdown.selectedIndex].text;
  
  //     // 이 부분에서는 선택된 값에 따라 학생 목록을 업데이트할 수 있습니다.
  //     // 예를 들어, 선택된 값이 "학번"일 때는 학번을 기준으로 학생 목록을 정렬하거나 필터링할 수 있습니다.
  
  //     document.querySelector("studentList").innerText = "선택된 값: " + selectedValue + ", 선택된 텍스트: " + selectedText;
  //   });
  }

  

/**
 * 실행 진입점
 */
function main() {
  eventRegister();
  // 학생 등록
  // 학생 전체 목록
  // 학생 검색
  // 학생 검색 (동명이인)
  // const array = studentService.findBySearch("ssn", 10);
  // const array = studentService.findBySearch("name", "바나나");
  // array.forEach((student) => console.log(student.toString()));
}

main();

