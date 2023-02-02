export default function getUserProfileToLocalStorage(name: string, value: string) {
  const retrievedString = localStorage.getItem('user-profile') || '{}';
  const parsedObject = JSON.parse(retrievedString as string);
  parsedObject[name] = `${value}`;
  const modifiedndstrigifiedForStorage = JSON.stringify(parsedObject);
  localStorage.setItem('user-profile', modifiedndstrigifiedForStorage);
}
