export const regExp = {
  strLowerCase: /^(?=.*[a-z])/,
  strUpperCase: /^(?=.*[A-Z])/,
  containsNum: /^(?=.*[0-9])/,
  containsSpecialChar: /^(?=.*[!@#$%^&*])/,
  onlyNumbers: /^\d+$/,
  email: /\S+@\S+\.\S+/,
  onlyLetterAndSpace: /^[a-zA-Z ]*$/,
  phoneRegExp:
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
  emojiRegex:
    /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}]/gu,
};
