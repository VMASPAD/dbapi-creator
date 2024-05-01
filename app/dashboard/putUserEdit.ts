interface UserData {
    email: string;
    pass: string;
    _id: string;
    framework: number;
    iddata: string;
    name: string;
    description: string;
}

export async function putUserEdit(
    email: String,
    pass: String,
    _id: String,
    originalFramework: String,
    framework: String,
    iddata: String,
    name: String,
    description: String
): Promise<UserData> {
    try {
        const response = await fetch("http://localhost:2000/api/userdata", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                pass: pass,
                id: _id,
                framework: framework,
                originalFramework: originalFramework,
                iddata: iddata,
                name: name,
                description: description,
            }),
        });

        if (response.ok) {
            const data: UserData = await response.json();
            console.log(data);
            return data;
        } else {
            console.error("Error al obtener los datos del usuario");
            throw new Error("Error al obtener los datos del usuario");
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        throw error;
    }
}
