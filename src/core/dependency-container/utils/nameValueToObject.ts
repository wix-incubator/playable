export default function(name, value) {
  let obj = name;
  if (typeof obj !== 'object') {
    obj = Object.assign({ [name]: value });
  }

  return obj;
}
