$(document).ready(function(){

let selected_id =''; 

function getAllusers(){

	$.post("/admin/users/all", function(res){
		if(res.error){
			alert(res.message);
		}
		else{
			setUserData(res.data);
		}
	})
}


function setUserData(data){

	for(let a=0; a< data.length; a++){

		let disabled = "";
		if(data[a].self){
			disabled = "disabled";
		}

		let html = "<tr>";
            html += "<td>"+data[a].created_at+"</td>";
            html += "<td>"+data[a].first_name +" "+ data[a].last_name+"</td>";
            html +=  "<td>"+data[a].email+"</td>";
            html +=  "<td>"+data[a].user+"</td>";
            html +=   "<td>"+data[a].admin+"</td>";
            html +=  "<td>";
            html += "<input type=hidden value='"+data[a].id+"' class='user-id'>";
            html += "<button class='btn btn-sm delete "+disabled+" btn-danger'>Delete</button>";
            html += "</td>";
            html += "</tr>";

        $(".users-data").append(html);
	}
}



$(document).on("click", ".delete", function(){

	$(".conf-modal").modal("show");
	selected_id = $(this).siblings(".user-id").val();
})


$(".user-remove").click(function(){

	$.post("/admin/user/delete", {selected_id}, function(res){

		if(res.error){
			alert(res.message);
		}
		else{
			$(".conf-modal").modal("toggle")
			location.reload();
		}
	})
})


getAllusers();
	
})