function print(fn) {
    const a = 200;
    fn();
  }
  
  const a = 100;
  function fn() {
    console.log(a);
  }
  
  print(fn); // 100