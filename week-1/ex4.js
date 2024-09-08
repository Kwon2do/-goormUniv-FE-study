const a = () => {
    console.log("작업 a 시작");
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("------작업 a 완료------");
            resolve(); // 작업 완료 후 resolve 호출
        }, 1000);
    });
}

const b = () => {
    console.log("작업 b 시작");
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("------작업 b 완료------");
            resolve(); // 작업 완료 후 resolve 호출
        }, 1000);
    });
}

const main = async() => {
    await a();  // a 작업이 끝날 때까지 대기
    await b();  // a가 끝난 후 b 작업 수행
}

main();