
window.onload = e => {
    // document.getElementById('bat').addEventListener("click", () => {
    //     fetch("/den", {
    //         method: 'post',
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             action: "bat"
    //         })
    //     })
    // })
    // document.getElementById('tat').addEventListener("click", () => {
    //     fetch("/den", {
    //         method: 'post',
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             action: "tat"
    //         })
    //     })
    // })

    var mySidebar = document.querySelector('#mySidebar')
    var sidebar = new coreui.Sidebar(mySidebar)

    $("#sidebar-toggler").click(e => {
        sidebar.toggle()

        $.post("/den", {
                        action: "bat"
                    },
            function (data, textStatus, jqXHR) {
                console.log("thanh cong")
            },
            "json"
        );
    })

    $("#sidebar-toggler").click(e => {
        sidebar.toggle()

        $.post("/den", {
                        action: "bat"
                    },
            function (data, textStatus, jqXHR) {
                console.log("thanh cong")
            },
            "json"
        );
    })

    let socket = io("http://localhost:3000")

    socket.on("temp", (dataJson) => {
        let data = JSON.parse(dataJson);
        $('#temp_living_room').html(data.data)
    })
}