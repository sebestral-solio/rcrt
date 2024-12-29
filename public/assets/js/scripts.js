 //-----------------------------------dynamic content for preview-----------------------------------
 function updatePreview() {
    document.getElementById('event-title-preview').innerText = document.getElementById('event_title').value;
    document.getElementById('event-location-preview').innerHTML = '<i class="fas fa-map-marker-alt"></i>&nbsp;' + document.getElementById('event_city').value;
    document.getElementById('price-seats').innerHTML = '<p style="margin-right: 30px;"><i class="fas fa-ticket-alt"></i> Rs. ' + document.getElementById('ticket_price').value + '</p>' + '<p style="margin-right: 30px;"><i class="fas fa-users"></i> ' + document.getElementById('ticket_quantity').value + '</p>' + '<a href="preview" style="margin-left: auto;">Preview <i class="fas fa-external-link-alt"></i></a>';
}

function previewImage(event) {

    var reader = new FileReader();
    reader.onload = function () {
        var imgElement = document.createElement('img');
        imgElement.src = reader.result;
        imgElement.className = 'img-fluid mt-3';
        document.getElementById('poster-preview').innerHTML = '';
        document.getElementById('poster-preview').appendChild(imgElement);
        var output = document.getElementById('event-poster-preview');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

function toggleLocationInput() {
    const onlineRadio = document.getElementById('online');
    const offlineRadio = document.getElementById('offline');
    const locationGroups = document.querySelectorAll('.location-group');

    if (onlineRadio.checked) {
        locationGroups.forEach(group => {
            group.style.display = 'none';
            const input = group.querySelector('input');
            input.value = 'Online';
            input.removeAttribute('required');
        });
    } else if (offlineRadio.checked) {
        locationGroups.forEach(group => {
            group.style.display = 'block';
            const input = group.querySelector('input');
            input.value = '';
            input.setAttribute('required', 'true');
        });
    }

    updatePreview();
}





document.getElementById('event_title').addEventListener('input', updatePreview);
document.getElementById('start_time').addEventListener('input', updatePreview);
document.getElementById('end_time').addEventListener('input', updatePreview);
document.getElementById('event_city').addEventListener('input', updatePreview);
document.getElementById('ticket_price').addEventListener('input', updatePreview);
document.getElementById('ticket_quantity').addEventListener('input', updatePreview);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

document.getElementById('event_date').addEventListener('input', function () {
    const selectedDate = new Date(this.value);
    const day = selectedDate.getDate();
    const monthIndex = selectedDate.getMonth();
    const monthName = monthNames[monthIndex];
    const year = selectedDate.getFullYear();

    const eventTimePreview = document.getElementById('event-time-preview');
    eventTimePreview.innerHTML = `<i class="fas fa-calendar-alt"></i>&nbsp;${monthName} ${day}, ${year}`;
});

updatePreview();

//----------------------form validate------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const requiredFields = document.querySelectorAll('[required]');
    const requiredError = document.getElementById('required-error');

    requiredFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.checkValidity()) {
                field.classList.remove('is-invalid');
                requiredError.style.display = 'none';
            }
        });
    });
});

function validateStep1() {
    let valid = true;
    const forms = [
        document.getElementById('event-overview-form'),
        document.getElementById('date-time-location-form'),
        document.getElementById('about-event-form')
    ];

    forms.forEach(form => {
        // Find all required fields within the form
        const requiredFields = form.querySelectorAll('[required]');
        const requiredError = document.getElementById('required-error');

        requiredFields.forEach(field => {
            if (!field.checkValidity()) {
                valid = false;
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
                field.classList.add('is-invalid');
                requiredError.style.display = 'block';
                return; // Exit the loop early if an invalid field is found
            } else {
                requiredError.style.display = 'none';

                field.classList.remove('is-invalid');
            }
        });
    });

    if (valid) {
        nextStep('#step-1', '#step-2');
    }
}

function validateStep2() {
    let valid = true;
    const forms = [
        document.getElementById('event-ticket-form')
    ];

    forms.forEach(form => {
        // Find all required fields within the form
        const requiredFields = form.querySelectorAll('[required]');
        const requiredError = document.getElementById('required-error2');

        requiredFields.forEach(field => {
            if (!field.checkValidity()) {
                valid = false;
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
                field.classList.add('is-invalid');
                requiredError.style.display = 'block';
                return; // Exit the loop early if an invalid field is found
            } else {
                requiredError.style.display = 'none';

                field.classList.remove('is-invalid');
            }
        });
    });

    if (valid) {
        nextStep('#step-2', '#step-3');
    }
}

function validateStep3() {
    let valid = true;
    const forms = [
        document.getElementById('publish-event-form')
    ];

    forms.forEach(form => {
        // Find all required fields within the form
        const requiredFields = form.querySelectorAll('[required]');
        const requiredError = document.getElementById('required-error3');

        requiredFields.forEach(field => {
            if (!field.checkValidity()) {
                valid = false;
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
                field.classList.add('is-invalid');
                requiredError.style.display = 'block';
                return; // Exit the loop early if an invalid field is found
            } else {
                requiredError.style.display = 'none';
                field.classList.remove('is-invalid');
            }
        });
    });

    if (valid) {
        document.getElementById('event-creation-form').submit();
        // publishEvent();
    }
}


//------------------------------------------------------------------------------------
$(document).ready(function () {
    // Event Overview toggle
    $('#btn-event-overview').click(function () {
        $('#section-event-overview').slideToggle();
        $('#toggle-event-overview i').toggleClass('fa-plus fa-minus');
    });

    // Date-Time-Location toggle
    $('#btn-date-time-location').click(function () {
        $('#section-date-time-location').slideToggle();
        $('#toggle-date-time-location i').toggleClass('fa-plus fa-minus');
    });

    // About Event toggle
    $('#btn-about-event').click(function () {
        $('#section-about-event').slideToggle();
        $('#toggle-about-event i').toggleClass('fa-plus fa-minus');
    });

    // Event Ticket toggle
    $('#btn-event-ticket').click(function () {
        $('#section-event-ticket').slideToggle();
        $('#toggle-event-ticket i').toggleClass('fa-plus fa-minus');
    });
});


function toggleTicketInput() {
    var ticketChecked = document.getElementById('free').checked;
    var ticketPrice = document.getElementById('ticketPrice');

    if (ticketChecked) {
        ticketPrice.style.display = 'none';
    } else {
        ticketPrice.style.display = 'block';
    }
}

function nextStep(currentStepId, nextStepId) {
    $(currentStepId).removeClass('active');
    $(nextStepId).addClass('active');
    $('html, body').animate({
        scrollTop: $(nextStepId).offset().top
    }, 500);
}

function prevStep(currentStepId, prevStepId) {
    $(currentStepId).removeClass('active');
    $(prevStepId).addClass('active');
    $('html, body').animate({
        scrollTop: $(prevStepId).offset().top
    }, 500);
}

function toggleSection(sectionId) {
    $(sectionId).toggle();
}

function publishEvent() {
    alert('Event published successfully!');
}

$(document).ready(function () {
    $('.sidebar-link').click(function () {
        var angleDown = $(this).find('.fas.fa-angle-down');
        var angleUp = $(this).find('.fas.fa-angle-up');
        angleDown.toggleClass('d-none');
        angleUp.toggleClass('d-none');
    });

    $('#aspirants').on('show.bs.collapse', function () {
        $('#students .fas.fa-angle-up').addClass('d-none');
        $('#students .fas.fa-angle-down').removeClass('d-none');
    });

    $('#students').on('show.bs.collapse', function () {
        $('#aspirants .fas.fa-angle-up').addClass('d-none');
        $('#aspirants .fas.fa-angle-down').removeClass('d-none');
    });


});
document.addEventListener('DOMContentLoaded', function () {
    const startDateInput = document.getElementById('ticket_date');
    const endDateInput = document.getElementById('ticket_end_date');
    const dateError = document.getElementById('date-error');

    function validateDates() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (endDate < startDate) {
            dateError.style.display = 'block';
            endDateInput.setCustomValidity('End date must be greater than start date.');
        } else {
            dateError.style.display = 'none';
            endDateInput.setCustomValidity('');
        }
    }

    startDateInput.addEventListener('change', validateDates);
    endDateInput.addEventListener('change', validateDates);
});