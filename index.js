const entities = [];
var currentEntityId = 0;
var currentEntityFieldNumber = 1;
var currentEntityRelationshipNumber = 0;

$(document).ready(function () {
    $('.collapse').collapse();
});

$("#export").click(function () {
    if (entities.length == 0)
        return;
    let fileName = 'cms_auto_studio_' + Date.now() + '.json';
    $("<a />", {
        "download": fileName,
        "href": "data:application/json," + encodeURIComponent(JSON.stringify(entities, undefined, 4))
    }).appendTo("body")
        .click(function () {
            $(this).remove();
        })[0].click();
});

$('#add-entity').click(function () {
    currentEntityId = entities.length;
    $('#accordion').append(getFieldItem(currentEntityId, currentEntityFieldNumber));
    $('.collapse').collapse();
});

$('#add-field').click(function () {
    currentEntityFieldNumber++;
    $('.collapse').collapse();
    $('#accordion').append(getFieldItem(currentEntityId, currentEntityFieldNumber));
});

$('#add-relationship').click(function () {
    currentEntityRelationshipNumber++;
    $('.collapse').collapse();
    $('#relationship-accordion').append(getRelationshipItem(currentEntityId, currentEntityRelationshipNumber));
    var entitySelect = $('#relationship-entity-' + currentEntityId + "-" + currentEntityRelationshipNumber);
    populateEntitySelect(entitySelect);
});

function populateEntitySelect(element) {
    $.each(entities, function (i, entity) {
        console.log(entity.modelName);
        element.append($('<option>', {
            value: entity.tableName,
            text: entity.modelName
        }));
    });
}

$("#accordion").on("click", "button.remove-field", function () {
    currentEntityFieldNumber--;
    $(this).closest("div.card").remove();
});

$("#relationship-accordion").on("click", "button.remove-relationship", function () {
    currentEntityRelationshipNumber--;
    $(this).closest("div.card").remove();
});

$("#relationship-accordion").on("change", "select.relationship-entity", function () {
    var foreignKeyFieldSelect = $(this).closest("div.card-body").find(".relationship-display-field");
    populateEntityFieldsSelect($("option:selected", this).text(), foreignKeyFieldSelect);
});

function populateEntityFieldsSelect(selectedOption, foreignKeyFieldSelect) {
    var entityIndex = entities.findIndex(x => x.modelName === selectedOption);
    $.each(entities[entityIndex].fields, function (i, field) {
        foreignKeyFieldSelect.append($('<option>', {
            value: field.name,
            text: field.placeholder
        }));
    });
}

$('#exampleModal').on('hidden.bs.modal', function () {
    $("#accordion").empty();
    $('#timestamp').val('');
    currentEntityFieldNumber = 1;
    currentEntityRelationshipNumber = 0;
    // $('#accordion .entity-card').slice(1).remove();
    $('#relationship-accordion .relationship-card').remove();
    $("#entity-form")[0].reset();
    $('.collapse').collapse();
});

$('#save-entity').click(function () {
    $('#save-entity').prop('disabled', true);
    if (!validateEntity(currentEntityFieldNumber)) {
        $('#save-entity').prop('disabled', false);
        return;
    }
    var fields = [];

    for (let i = 0; i < currentEntityFieldNumber; i++) {
        if (!validateField(fields, i)) {
            $('#save-entity').prop('disabled', false);
            return;
        }
        var field = {
            dataType: $('.field-database-data-type').eq(i).val(),
            name: $('.field-table-name').eq(i).val(),
            placeholder: $('.field-placeholder').eq(i).val(),
            inputType: $('.field-input-data-type').eq(i).val(),
            isVisible: $('.field-visibility').eq(i).is(":checked"),
            foreignKey: null
        }
        fields.push(field);
    }

    for (let i = 0; i < currentEntityRelationshipNumber; i++) {
        if (!validateRelationship(entities, fields, i)) {
            $('#save-entity').prop('disabled', false);
            return;
        }
        var relationship = {
            dataType: 'unsignedBigInteger',
            name: $('.relationship-name').eq(i).val(),
            placeholder: $('.relationship-placeholder').eq(i).val(),
            inputType: 'foreign_key',
            isVisible: $('.relationship-visibility').eq(i).is(":checked"),
            foreignKey: {
                modelName: $('.relationship-entity option:selected').eq(i).text(),
                tableName: $('.relationship-entity').eq(i).val(),
                displayField: $('.relationship-display-field').eq(i).val()
            }
        }
        fields.push(relationship);
    }

    var entity = {
        modelName: $('#model').val(),
        tableName: $('#table').val(),
        fields: fields,
        timestamp: Date.now()
    };

    $timestamp = $('#timestamp').val();
    $('#exampleModal').modal('hide');
    $oldModelName = null;

    if ($timestamp.length > 0) {
        // TODO dont update if nothing has changed
        $oldEntityIndex = entities.findIndex(x => x.timestamp == $timestamp);
        $oldModelName = entities[$oldEntityIndex].modelName
        $('#entity-' + $oldModelName).remove();
        entities[$oldEntityIndex] = entity;
    } else {
        entities.push(entity);
    }

    createEntityCard(entity, $oldModelName);
    $('#save-entity').prop('disabled', false);
});

function createEntityCard(entity, oldModelName) {
    var fields = '';
    var relationships = '';
    var relationLines = [];
    for (let i = 0; i < entity.fields.length; i++) {
        if (entity.fields[i].foreignKey == null) {
            fields += getEntityCardFields(entity.fields[i].name, entity.fields[i].dataType);
        } else {
            relationLines.push(entity.fields[i].foreignKey.modelName);
            relationships += getEntityCardRelationships(entity.fields[i].name, entity.fields[i].foreignKey.modelName);
        }
    }
    $element = getEntityCard(entity.modelName, fields, relationships);
    $($element).appendTo('#container').draggable({ containment: ".container-fluid" });

    if (relationLines.length > 0) {
        $("#entity-" + entity.modelName).addClass('has-relation');
        $.each(relationLines, function (index, value) {
            $('#entity-' + value).addClass('has-relation');
            $("#entity-" + entity.modelName).connections({
                to: '#entity-' + value,
                within: "#container",
                'class': 'relation',
                tag: "inner",
                css: { borderStyle: "dashed", color: "#ffc107" }
            });
        });
    }

    if (oldModelName !== null)
        updateRelationships(oldModelName, entity.modelName);
}

function updateRelationships(oldModelName, newModelName) {
    $.each(entities
        .filter((element) => element.fields.some((field) => field.foreignKey !== null && field.foreignKey.modelName === oldModelName)), function (index, value) {

            $.each(value.fields.filter(x => x.foreignKey !== null && x.foreignKey.modelName === oldModelName), function (fIndex, fValue) {
                fValue.foreignKey.modelName = newModelName;
                fValue.foreignKey.displayField = 'id';
            });

            $('#entity-' + value.modelName).connections({
                to: "#entity-" + newModelName,
                within: "#container",
                'class': 'relation',
                tag: "inner",
                css: { borderStyle: "dashed", color: "#ffc107" }
            });
        });

    if (oldModelName != newModelName)
        $('.card-fk-model-name:contains(' + oldModelName + ')').text(newModelName);
}

$("#container").on("click", "button.delete-entity", function () {
    var entityId = $(this).data("model-name");
    entities.splice(entities.findIndex(x => x.modelName === entityId), 1);
    deleteForeignKeys(entityId);
    $('#entity-' + entityId).remove();
});

$("#container").on("mousedown", ".has-relation", function () {
    setInterval(function () {
        $('.relation').connections('update');
    }, 1);
});

$("#container").on("click", "button.edit-entity", function () {
    $entityIndex = entities.findIndex(x => x.modelName === $(this).data('model-name'));
    $entity = entities[$entityIndex];
    $('#model').val($entity.modelName);
    $('#table').val($entity.tableName);
    $('#timestamp').val($entity.timestamp);

    currentEntityFieldNumber = 0;
    $.each($entity.fields.filter(x => x.foreignKey === null), function (index, value) {
        currentEntityFieldNumber++;
        $('#accordion').append(getFieldItem($entityIndex, currentEntityFieldNumber));
        $("input.field-table-name").last().val(value.name);
        $("input.field-placeholder").last().val(value.placeholder);
        $("select.field-database-data-type").last().val(value.dataType);
        $("select.field-input-data-type").last().val(value.inputType);
        $("input.field-visibility").last().prop('checked', value.isVisible);
    });

    $.each($entity.fields.filter(x => x.foreignKey !== null), function (index, value) {
        currentEntityRelationshipNumber++;

        $('#relationship-accordion').append(getRelationshipItem(currentEntityId, currentEntityRelationshipNumber));
        var entitySelect = $('#relationship-entity-' + currentEntityId + "-" + currentEntityRelationshipNumber);
        populateEntitySelect(entitySelect);

        $("select.relationship-entity").last().val(value.foreignKey.tableName);
        $("input.relationship-name").last().val(value.name);
        $("input.relationship-placeholder").last().val(value.placeholder);
        $("input.relationship-visibility").last().prop('checked', value.isVisible);

        $displayField = $("select.relationship-display-field").last();
        populateEntityFieldsSelect(value.foreignKey.modelName, $displayField);
        $displayField.val(value.foreignKey.displayField);
    });

    $('.collapse').collapse();
    $('#exampleModal').modal('show');
});

function deleteForeignKeys(modelName) {
    $.each(entities, function (index, value) {
        var foreignKeyIndex = value.fields.findIndex(x => x.foreignKey != null && x.foreignKey.modelName === modelName);
        if (foreignKeyIndex == -1)
            return true;

        deleteForeignKeyFromCard(value.modelName, value.fields[foreignKeyIndex].foreignKey.modelName);
        value.fields.splice(foreignKeyIndex, 1);
    });
}

function deleteForeignKeyFromCard(entityName, foreignKeyName) {
    $cardField = $("#entity-" + entityName + " .card-relationships li:contains(" + foreignKeyName + ")");
    $cardField.remove();
}
