$(document).ready(function(){

function getTicketsCount(){
	$.post("/admin/tickets/count", function(res){
		$(".new").text(res.open);
		$(".on_hold").text(res.on_hold);
		$(".close").text(res.close);
		$(".all").text(res.total);
	})
}

function resetNotif(){
	$(".notif").each(function(){
		$(this).addClass("d-none");
	})
}

function getAllTicket(){

	resetNotif();
	$(".load").removeClass("d-none");
	$(".tickets-content").empty();

	$.post("/admin/tickets/get/all", function(res){

		resetNotif();
		
		if(! res.error){
			if(res.data){
				//data
				setTable(res.data);
			}
			else{
				//no data
				$(".no-data").removeClass("d-none");
			}
		}
		else{
			//error
			$(".error").removeClass("d-none");
		}
	})
}

function truncateText(text, length) {
  if (text.length <= length) {
    return text;
  }

  return text.substr(0, length) + '\u2026'
}

function setTable(data){

	$(".tickets-content").empty();

	for(let a=0; a<data.length; a++){

		let badge = 'success';
	
		if(data[a].status == "On Hold"){
			badge = 'danger';
		}

		if(data[a].status == "open"){
			badge = 'primary';
		}
		
		let	html = "<tr>";
			html += "<td>"+ data[a].ticket_id+"</td>"; 
			html += "<td>"+ data[a].created_at+"</td>";
			html += "<td>"+ data[a].updated_at+"</td>";
			html += "<td><span class='badge bg-"+ badge +"'>"+ data[a].status+"</span></td>";
			html += "<td>"+ data[a].assigned+"</td>";
			html += "<td>"+ data[a].subject+"</td>";
			html += "<td>"+ data[a].erp +"</td>";
			html += "<td class='d-none'>" +data[a].description + "</td>";
			html += "<td class='noExl'>" + truncateText(data[a].description, 15) + "</td>";
			html += "<td class='noExl'>";
            html += "<input class='ticket_id' type='hidden' value='"+data[a].ticket_id+"'>";
            html += "<button class='btn-sm btn btn-primary view'>view</button>";
            html += "</td>";
            html += "</tr>";

        $(".tickets-content").append(html);
	}
}

$(".excelExport").click(function(){

	 $(".all-tickets").table2excel({
	 	exclude:".noExl",
	    name:"Worksheet Name",
	    filename:"Issue Logger",
	    fileext:".xlsx" 

	  });

})


$(".ticket-id-search").keyup(function(){
	const len = $(this).val().length;

	if(len == 0){
		getAllTicket();
	}
})



$(".search-btn").click(function(){

	$(".tickets-content").empty();
	resetNotif();
	$(".load").removeClass("d-none");

	const ticket_id = $(".ticket-id-search").val();

	$.post("/ticket/search", {ticket_id}, function(res){

		resetNotif();

		if(! res.error){
			if(res.data){
				//data
				setTable(res.data);
			}
			else{
				//no data
				$(".no-data").removeClass("d-none");
			}
		}
		else{
			//error
			$(".error").removeClass("d-none");
		}

	})

})


$(".ticket-id-search").keydown(function(event) {

  if (event.keyCode && event.which === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    //call function, trigger events and everything tou want to dd . ex : Trigger the button element with a click
    $(".search-btn").trigger('click');
  }
});






/*********************Process the ticket ****************/
$(document).on("click", ".view", function(){

	const ticket_id = $(this).siblings(".ticket_id").val();

	$(".view-process").modal("show");
	$(".view-load").removeClass("d-none");
	$(".view-error").addClass("d-none");

	$.post("/admin/ticket/view-process", {ticket_id}, function(res){

		$(".view-load").addClass("d-none");
		if(res.error){
			//something went wrong
			$(".view-error").removeClass("d-none");
		}
		else{
			if(res.data){
				//no error 
				setPreviewTicket(res.data);

			}	
			else{
				//no data found
				alert("No Data Found");
				$(".view-process").modal("toggle");
			}
		}
	})

	ticketTrack(ticket_id); 
})


function setPreviewTicket(data){

	$(".ticket-id-process").val(data.ticket_id);

	const updated_at= moment(new Date(data.updated_at)).format('lll');
	const created_at = moment(new Date(data.created_at)).format('lll')

	//Basic Ticket Details 
	$(".ticket-id").text(data.ticket_id);
	$(".ticket-createdBy").text(data.created_by);
	$(".ticket-status").text(data.status);
	$(".ticket-priority").text(data.priority);
	$(".ticket-updatedAt").text(updated_at);
	$(".ticket-createdAt").text(created_at);

	//Ticket more details
	$(".ticket-issue").text(data.issue);
	$(".ticket-sector").text(data.sector);
	$(".ticket-erp").text(data.erp);
	$(".ticket-region").text(data.region);


	const description = data.description; 
	if(description){
		//desrcriptin  exist
		$(".ticket-description").text(description);
	}
	else{
		//user didnt provide description
		$(".ticket-description").html("<i class='bi bi-dash-circle-fill text-warning'></i></i><span class='fw-bold text-muted'>  No Description</span>");
	}

	$(".ticket-file").empty();

	const file = data.file;
	if(file){

		console.log(file);

		$(".ticket-file").html("<i class='i bi-file-earmark-fill'></i><a href='"+file+"'> download </a>");
	}
	else{
		$(".ticket-file").html("<i class='bi bi-dash-circle-fill text-warning'></i></i><span class='fw-bold text-muted'>  No File Attached</span>");
	}
}


function ticketTrack(ticket_id){
	$.post("/ticket/track", {ticket_id}, function(res){

		if(!res.error){
			 setTrack(res.data)
		}
		else{
			//error
		}

	});
}


function setTrack(data){

	$(".track-content").empty();

	for(let a=0; a<data.length; a++){
		let line = '';
		if(a <  data.length -1 ){
			line ='vline';
		}

		let badge = 'success';
		if(data[a].status == "On hold"){
			badge = 'danger';
		}

		if(data[a].status == "pending"){
			badge = 'primary';
		}

		let html = "<div class='container d-flex  justify-content-start align-items-center mt-3 position-relative'>";
	        html += "<div class='d-flex flex-column align-items-center' style='width: 150px'>";
	        html += "<span>"+data[a].created_date+"</span>";
	        html += "<span>"+data[a].created_time+"</span>";
	        html += "</div>";
	        html += "<i class='bi bi-circle-fill ms-2 fs-6 text-secondary "+line+"'></i>";
	        html += "<div class='d-flex flex-column align-items-start ms-4' style='width: 300px;'>";
	        html += "<span class='fw-bold'>"+data[a].subject+"</span>";
	        html += "<span class='badge bg-"+badge+"'>"+data[a].status+"</span>";
	        html += "<span class='f-12'>"+data[a].details+"</span>";
	        html += "<span class='f-12'> <i class='bi bi-person'></i>  "+data[a].name+"</span>";
	        html += "</div>";
	        html += " </div>";
		
		$(".track-content").append(html); 
	}
}





getTicketsCount();
getAllTicket();



})