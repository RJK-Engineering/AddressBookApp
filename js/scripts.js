
// app initialization
$(document).ready(function() {
    // do not initialize app if no storage support
    if (typeof(Storage) === "undefined") {
        alert ("No web storage support");
        return;
    }

    // add handlers for navigation
    $('#showList').click(function() {
        $('#addressForm').hide();
        $('#addressList').show();
    });
    $('#showNew').click(function() {
        // reset form
        $('#addressForm input').each(function() {
            $(this).val("");
        });
        $('#formButton').text("Add");

        // hide list, show form
        $('#addressList').hide();
        $('#addressForm').show();
    });

    // form handler
    $('#formButton').click(storeAddress);

    // create list from stored addresses
    var addresses = getAdresses();
    createList(addresses);
});

// create list from stored addresses
function createList(addresses) {
    var tbody = $('<tbody/>');

    for (var i=0; i<addresses.length; i++) {
        var address = addresses[i];

        var tr = $('<tr/>');
        tr.append('<td>' + i + '</td>');
        tr.append('<td>' + address.name + '</td>');
        tr.append('<td>' + address.address + '</td>');

        var button = $('<button>Edit</button>');
        button.click(editAddress);
        var td = $('<td/>');
        td.append(button);

        button = $('<button>Remove</button>');
        button.click(removeAddress);
        td.append(button);

        tr.append(td);
        tbody.append(tr);
    }

    var table = $('<table/>');
    table.append('<thead><tr><th>Nr</th><th>Name</th><th>Address</th><th></th></tr></thead>');
    table.append(tbody);

    var div = $('<div id="addressList"/>');
    div.append(table);
    $('#addressList').replaceWith(div);
}

function editAddress() {
    // get address in row
    var tr = $(this).closest('tr').children();
    var address = {};
    address.nr = tr[0].innerHTML;
    address.name = tr[1].innerHTML;
    address.address = tr[2].innerHTML;

    // populate form
    $('#addressForm input[name=nr]').val(address.nr);
    $('#addressForm input[name=name]').val(address.name);
    $('#addressForm input[name=address]').val(address.address);
    $('#formButton').text("Update");

    // hide list, show form
    $('#addressList').hide();
    $('#addressForm').show();
}

function removeAddress() {
    // get address number in row
    var tr = $(this).closest('tr').children();
    var nr = tr[0].innerHTML;

    // remove
    var addresses = getAdresses();
    addresses.splice(nr, 1);
    storeAdresses(addresses);

    // refresh list
    createList(addresses);
}

// store (add or update) address
function storeAddress() {
    // get address data
    var address = {};
    address.nr      = $('#addressForm input[name=nr]').val();
    address.name    = $('#addressForm input[name=name]').val();
    address.address = $('#addressForm input[name=address]').val();
    // check values
    if (!address.name || !address.address) { return; }

    var addresses = getAdresses();
    if (address.nr) {
        // update
        addresses[address.nr] = address;
    } else {
        // add
        addresses.push(address);
    }
    storeAdresses(addresses);
}

// retrieve addresses from storage
function getAdresses() {
    var str = localStorage.getItem('addresses');
    return str == null ? [] : JSON.parse(str);
}

// store addresses in storage
function storeAdresses(addresses) {
    localStorage.setItem('addresses', JSON.stringify(addresses));
}
