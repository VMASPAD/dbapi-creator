export default async function changeApiDb(){
    const response = await fetch("http://localhost:2000/api/user-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'email':'',
          'id':'',
          'newuseremail':'',
        },
      });
      return response
}