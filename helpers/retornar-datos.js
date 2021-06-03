
const retornarDatos = async (snap) => {
    const data = []

    snap.forEach(( snapHijo => {
        data.push({
            id: snapHijo.id,
            ...snapHijo.data()
        })
    }))

    return data
}

module.exports = retornarDatos