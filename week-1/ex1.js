//setTimeout - 일정 시간 경과에 따라 비동기적으로 작업을 처리하도록 유도하는 함수
console.log("작업 시작");

setTimeout(() => {
  console.log("작업 1번 완료");
}, 1000);

setTimeout(() => {
  console.log("작업 2번 완료");
}, 2000);

setTimeout(() => {
  console.log("작업 3번 완료");
}, 3000);

console.log("모든 작업 처리 완료");

//출력 결과는 어떻게 될까요??