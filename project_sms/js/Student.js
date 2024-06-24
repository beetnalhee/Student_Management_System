function Student (ssn, name, korean, english, math) {
 
    this.ssn = ssn;
    this.name = name;
    this.korean = korean;
    this.english = english;
    this.math = math;
  }
  
  Student.prototype.getSum = function () {
    return this.korean + this.english + this.math
  }

  Student.prototype.getAverage = function () {
    return (this.getSum() / 3).toFixed(1);
  }
  
  //Object의 toString() 재정의 (Overriding)
  Student.prototype.toString = function () {
    return `${this.ssn}\t${this.name}\t${this.korean}\t${this.english}\t${this.math}\t${this.getSum()}\t${this.getAverage()}`;
  }

  
