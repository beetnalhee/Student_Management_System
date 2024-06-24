/**
 * 데이터 관리
 */

// 더미데이터 일부만 생성하기 
// 하나하나의 이벤트가 함수가 되는 것 

function StudentService(){
  this.students = [];
}

// 학생등록
StudentService.prototype.addStudent = function(student){
  this.students.push(student);
}

// 학생 목록 반환
StudentService.prototype.findAll = function(){
  return this.students;
}

// 학생 검색
StudentService.prototype.findBySearch = function(type, value){
  let searchResult = null;
 searchResult = this.students.filter((student)=>{
    if(type === "ssn"){
      return student.ssn === value;
    }else if(type === "name"){
      return student.name === value;
    }
  });
  return searchResult;
}

// const ssn = document.querySelector("#ssn");
// const name = document.querySelector("#name");
// const korean = document.querySelector("#korean");
// const english = document.querySelector("#english");
// const math = document.querySelector("#math");

// ssn.addEventListener("click", (event) => {
//   event.preventDefault();
//   const list = document.createElement("td");

// });


