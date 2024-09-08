const a = () => {
    console.log("작업 a시작");
    setTimeout(() => {
        console.log("------작업 a완료------");
    }, 1000);
}
const b = () => {
    console.log("작업 b시작");    
    setTimeout(() => {
        console.log("------작업 b완료------");
    }, 1000);
}
//await는 Promise가 반환되어야 기다림의 의미를 갖는다.
const main = async() => {
    await a()
    await b()
}