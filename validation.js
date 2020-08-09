
function showError(text) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: text
    })
}

function validateEntity(fieldsNum) {
    $model = $('#model').val();
    $table = $('#table').val();
    $timestamp = $('#timestamp').val();
    if (!$model) {
        showError('Model name cannot be empty!');
        return false;
    } else if (!$table) {
        showError('Table name cannot be empty!');
        return false;
    } else if (entities.some(e => e.modelName === $model && e.timestamp != $timestamp)) {
        showError('Entity with given model name already exists!');
        return false;
    } else if (entities.some(e => e.tableName === $table && e.timestamp != $timestamp)) {
        showError('Entity with given table name already exists!');
        return false;
    }else if(fieldsNum <= 0){
        showError('Entity must have at least one field defined!');
        return false;
    }
    return true;
}

function validateField(existingFields, currentFieldIndex) {
    $dataType = $('.field-database-data-type').eq(currentFieldIndex).val();
    $name = $('.field-table-name').eq(currentFieldIndex).val();
    $placeholder = $('.field-placeholder').eq(currentFieldIndex).val();
    $inputType = $('.field-input-data-type').eq(currentFieldIndex).val();
    if (!$name) {
        showError('Field #' + (currentFieldIndex + 1) + ' table name cannot be empty!');
        return false;
    } else if (!$placeholder) {
        showError('Placeholder for field #' + (currentFieldIndex + 1) + ' cannot be empty!');
        return false;
    } else if (!$dataType) {
        showError('Field #' + (currentFieldIndex + 1) + ' data type cannot be empty!');
        return false;
    } else if (!$inputType) {
        showError('Field #' + (currentFieldIndex + 1) + ' input type cannot be empty!');
        return false;
    } else if (existingFields.some(e => e.name === $name)){
        showError('Field #' + (currentFieldIndex + 1) + ' field or relationship with given name already exists!');
        return false;
    }else if (existingFields.some(e => e.placeholder === $placeholder)){
        showError('Field #' + (currentFieldIndex + 1) + ' field or relationship with given placeholder already exists!');
        return false;
    }
    return true;
}

function validateRelationship(existingEntities, existingFields, currentRelationshipIndex) {
    $tableName = $('.relationship-entity').eq(currentRelationshipIndex).val();
    $modelName = $('.relationship-entity option:selected').eq(currentRelationshipIndex).text();
    $relationshipName = $('.relationship-name').eq(currentRelationshipIndex).val();
    $placeholder = $('.relationship-placeholder').eq(currentRelationshipIndex).val();
    $displayField = $('.relationship-display-field').eq(currentRelationshipIndex).val();
    if (!$tableName) {
        showError('Relationship #' + (currentRelationshipIndex + 1) + ' - foreign entity cannot be empty!');
        return false;
    } else if (!$relationshipName) {
        showError('Relationship #' + (currentRelationshipIndex + 1) + '- relationship name cannot be empty!');
        return false;
    } else if (!$placeholder) {
        showError('Relationship #' + (currentRelationshipIndex + 1) + '- placeholder cannot be empty!');
        return false;
    } else if (!$displayField) {
        showError('Relationship #' + (currentRelationshipIndex + 1) + '- foreign entity display field cannot be empty!');
        return false;
    } else if (!existingEntities.some(e => e.tableName === $tableName)){
        showError('Relationship #' + (currentRelationshipIndex + 1) + '- foreign entity does not exist!');
        return false;
    }else if (existingFields.some(e => e.name === $relationshipName)){
        showError('Relationship #' + (currentRelationshipIndex + 1) + '- field or relationship with given name already exists!');
        return false;
    }else if (existingFields.some(e => e.placeholder === $placeholder)){
        showError('Relationship #' + (currentRelationshipIndex + 1) + '- field or relationship with given placeholder already exists!');
        return false;
    }else if($displayField != 'id' && !existingEntities[existingEntities.findIndex(x => x.tableName === $tableName)].fields.some(e => e.name === $displayField)){
        showError('Relationship #' + (currentRelationshipIndex + 1) + '- foreign entity display field does not exist!');
        return false;
    }
    return true;
}
