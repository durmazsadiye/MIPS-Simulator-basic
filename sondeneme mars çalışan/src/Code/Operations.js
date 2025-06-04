import ActionTypes from "../Store/ActionTypes";

class Operations {
  static New(pattern, stateFunctor) {
    pattern = pattern.replace(/#/g, "(.+)").replace(/_/g, "\\s*");
    Operations.Instructions[pattern] = stateFunctor;
  }

  static Nop() {
    return Operations.GetInstruction("nop");
  }

  static GetInstruction(userInput) {
    userInput = userInput.trim();
    const patterns = Object.keys(Operations.Instructions);
    let foundIndex = -1;
    let currentIndex = 0;

    let patternAsRegex;
    while (foundIndex < 0 && currentIndex < patterns.length) {
      patternAsRegex = new RegExp(patterns[currentIndex]);
      if (patternAsRegex.test(userInput)) {
        foundIndex = currentIndex;
      }
      currentIndex++;
    }

    // Replace null with a nop to get Nop when cant recognize instruction
    if (foundIndex < 0) {
      return Operations.GetInstruction("nop");
    }
    // Calling this with the appropriate number of arguments will give us the state mutator
    const args = patternAsRegex
      .exec(userInput)
      .slice(1)
      .map((x) => x.trim());

    // Function that takes in arguments for an operation and returns a function
    // that takes in a state and mutates it based on the operation
    const stateFunctor = Operations.Instructions[patterns[foundIndex]];
    const valueFunctor = stateFunctor.apply(null, args);

    return {
      type: ActionTypes.INSTRUCTION,
      payload: valueFunctor,
    };
    //console.log((stateFunctor("$s0", "$s1", "$s2"))({ registers: { "$s1": 5, "$s2": 7 }}));
    //console.log((stateFunctor.apply(null, args))({ registers: { "$s1": 5, "$s2": 7 }}));
  }
}
Operations.Instructions = {};

///////////////////////////////////////////////////////////////////////
//\\//\\//\\//          HELPER FUNCTIONS                 //\\//\\//\\//
///////////////////////////////////////////////////////////////////////
// add $s0, $s1, $s2
Operations.New("add _#_,_#_,_#_", (rd, rs, rt) => {
  return (state) => {
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: parseInt(state.registers[rs]) + parseInt(state.registers[rt]),
      },
    };
  };
});

// sub $s0, $s1, $s2
Operations.New("sub #,#,#", (rd, rs, rt) => {
  return (state) => {
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: parseInt(state.registers[rs]) - parseInt(state.registers[rt]),
      },
    };
  };
});

//and $s0, $s1, $s2
Operations.New("and _#_,_#_,_#_", (rd, rs, rt) => {
  return (state) => {
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: parseInt(state.registers[rs] & state.registers[rt]),
      },
    };
  };
});
//andi $s0, $s1, $s2
Operations.New("andi _#_,_#_,_#_", (rd, rs, immediate) => {
  return (state) => {
    let v1 = parseInt(state.registers[rs]);
    let v2 = parseInt(immediate);
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: v1 & v2,
      },
    };
  };
});

// addi $s0, $s1, 100
Operations.New("addi _#_,_#_,_#_", (rt, rs, immediate) => {
  return (state) => {
    let v1 = parseInt(state.registers[rs]);
    let v2 = parseInt(immediate);

    return {
      ...state,
      registers: {
        ...state.registers,
        [rt]: v1 + v2,
      },
    };
  };
});

//or $s0,$s1,$s2
Operations.New("or _#_,_#_,_#_", (rd, rs, rt) => {
  return (state) => {
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: parseInt(state.registers[rs] | state.registers[rt]),
      },
    };
  };
});
//ori $s0,$s1,immediate
Operations.New("ori _#_,_#_,_#_", (rd, rs, immediate) => {
  return (state) => {
    let v1 = parseInt(immediate);
    let v2 = state.registers[rs];
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: v1 | v2,
      },
    };
  };
});

//sll $s0,$s1,immediate
Operations.New("sll _#_,_#_,_#_", (rd, rt, immediate) => {
  return (state) => {
    let v1 = parseInt(immediate);
    let v2 = parseInt(state.registers[rt]);
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: v2 << v1,
      },
    };
  };
});


//nor $s0,$s1,$s2
Operations.New("nor _#_,_#_,_#_", (rd, rs, rt) => {
  return (state) => {
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: ~(state.registers[rs] | state.registers[rt]),
      },
    };
  };
});

//slt $s0,$s1,$s2
Operations.New("slt _#_,_#_,_#_", (rd, rs, rt) => {
  return (state) => {
    let v1 = parseInt(state.registers[rs]);
    let v2 = parseInt(state.registers[rt]);
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: v1 < v2 ? 1 : 0,
      },
    };
  };
});

// beq $s0, $s1, label
Operations.New("beq _#_,_#_,_#_", (rs, rt, label) => {
  return (state) => {
    let shouldBranch = state.registers[rs] === state.registers[rt];
    if (shouldBranch) {
      return {
        ...state,
        programCounter: state.jumpTable[label],
      };
    } else {
      return { ...state };
    }
  };
});

//bne $s0, $s1, label
Operations.New("bne _#_,_#_,_#_", (rs, rt, label) => {
  return (state) => {
    let shouldBranch = state.registers[rs] !== state.registers[rt];
    if (shouldBranch) {
      return {
        ...state,
        programCounter: state.jumpTable[label],
      };
    } else {
      return { ...state };
    }
  };
});

// nop
Operations.New("nop", () => {
  return (state) => {
    return { ...state };
  };
});

// j loop
Operations.New("j _#_", (label) => {
  return (state) => {
    return {
      ...state,
      programCounter: state.jumpTable[label],
    };
  };
});

// jal loop
Operations.New("jal _#_", (label) => {
  return (state) => {
    return {
      ...state,
      programCounter: state.jumpTable[label],
      registers: {
        ...state.registers,
        $ra: state.programCounter,
      },
    };
  };
});


//move $s0,$s1
Operations.New("move _#_, _#_", (rd, rs) => {
  return (state) => {
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: parseInt(state.registers[rs]),
      },
    };
  };
});





Operations.New("mult _#_,_#_", (rs, rt, hi = 0, lo = 0) => {
  return (state) => {
    let a = parseInt(state.registers[rs]);
    let b = parseInt(state.registers[rt]);
    let res = a * b;
    let resString = res.toString().length;
    return {
      ...state,
      registers: {
        ...state.registers,
        hi: Math.floor(
          res / Math.pow(10, resString - Math.floor(resString / 2))
        ),
        lo: Math.floor(res % Math.pow(10, Math.floor(resString / 2))),
      },
    };
  };
});

Operations.New("mul _#_,_#_,_#_", (rd, rs, rt) => {
  return (state) => {
    let a = parseInt(state.registers[rs]);
    let b = parseInt(state.registers[rt]);
    let res = a * b;
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: parseInt(res),
      },
    };
  };
});



Operations.New("srl _#_,_#_,_#_", (rd, rt, immediate) => {
  return (state) => {
    let v1 = parseInt(state.registers[rt]);
    let v2 = parseInt(immediate);
    let result = v1 >>> v2;
    return {
      ...state,
      registers: {
        ...state.registers,
        [rd]: result,
      },
    };
  };
});

// lw rt, offset(rs)
Operations.New("lw _#_,_#_(_#_)", (rt, offset, rs) => {
  return (state) => {
    // offset ve rs'yi kullanarak bellekteki değeri alıyoruz
    const address = parseInt(offset) + parseInt(state.registers[rs]);
    const value = state.memory[address] || 0;  // Bellekte olmayan adreslere varsayılan 0
    return {
      ...state,
      registers: {
        ...state.registers,
        [rt]: value,  // rt register'ına değeri yüklüyoruz
      },
    };
  };
});

// sw rt, offset(rs)
Operations.New("sw _#_,_#_(_#_)", (rt, offset, rs) => {
  return (state) => {
    // offset ve rs'yi kullanarak adresi hesaplıyoruz
    const address = parseInt(offset) + parseInt(state.registers[rs]);
    const value = parseInt(state.registers[rt]);  // rt register'ından değeri alıyoruz
    return {
      ...state,
      memory: {
        ...state.memory,
        [address]: value,  // Belleğe değeri yazıyoruz
      },
    };
  };
});

// jr rs
Operations.New("jr _#_", (rs) => {
  return (state) => {
    // rs register'ındaki değeri kullanarak program sayacını ayarlıyoruz
    return {
      ...state,
      programCounter: state.registers[rs],
    };
  };
});



export default Operations;
