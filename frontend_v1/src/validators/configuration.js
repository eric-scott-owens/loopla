
const allowedCharactersForUserNames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0','.',' '];

export const User = {
  firstName: {
    maxLength: 30,
    isRequired: true,
    allowedCharacters: allowedCharactersForUserNames
  },
  middleName: {
    maxLength: 30,
    allowedCharacters: allowedCharactersForUserNames
  },
  lastName: {
    maxLength: 30,
    isRequired: true,
    allowedCharacters: allowedCharactersForUserNames
  },
  telephoneNumber: {
    min: 0
  },
  email: {
    isRequired: true
  },
  password: {
    maxLength:4096,
    minLength:8,
    isRequired: true
  },
  username: {
    isRequired: true,
    maxLength: 150,
    minLength: 3,
    allowedCharacters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0','@','/','.','/','+','/','-','/','_'],
  },
  addressLine1: {
    maxLength:80
  },
  addressLine2: {
    maxLength:80
  },
  addressLine3: {
    maxLength:80
  },
  city: {
    isRequired: false
  },
  state: {
    isRequired: false,
    maxLength: 2
  },
  zipcode: {
    isRequired: false,
    min: 0
  },
  biography: {
    isRequired: false,
    maxLength: 100
  }
};

export const Post = {
  text: {
    isRequired: true,
  },
  summary: {
    isRequired: true,
    maxLength: 60
  },
  loop: {
    isRequired: true,
    min: 0,
    isInteger: true
  },
  photos: {

  }
}

export const Comment = {
  text: {
    isRequired: true
  },
  photos: {

  }
}

export const Loop = {
  name: {
    isRequired: true,
    maxLength: 80
  },
  circle: {
    
    description: {
      isRequired: false
    },
    guidelines: {
      isRequired: false
    },
    city: {
      isRequired: false,
      maxLength: 80
    },
    state: {
      isRequired: false,
      maxLength: 2
    }
  }
}

export const Waitlist = {
  firstName: {
    maxLength: 30,
    isRequired: true,
    allowedCharacters: allowedCharactersForUserNames
  },
  lastName: {
    maxLength: 30,
    isRequired: true,
    allowedCharacters: allowedCharactersForUserNames
  },
  email: {
    isRequired: true
  },
  comment: {
    isRequired: false
  }
}

export const Feedback = {
  text: {
    isRequired: true
  },
  photos: {

  }
}
