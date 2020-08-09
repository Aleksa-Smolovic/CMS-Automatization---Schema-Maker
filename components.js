function getFieldItem(entityId, entityFieldNumber) {
    return `<div class="mt-2 card entity-card">
<div class="card-header bg-info" id="headingOne">
    <h5 class="mb-0">
        <button type="button" class="btn btn-link text-white" data-toggle="collapse"
            data-target="#field-collapse-` + entityId + `-` + entityFieldNumber + `" aria-expanded="false" aria-controls="field-collapse-` + entityId + `-` + entityFieldNumber + `">
            Entity field ` + entityFieldNumber + `#
        </button>

        <button type="button" class="close remove-field" aria-label="Close">
            <span aria-hidden="true" class="text-white">&times;</span>
        </button>
    </h5>
</div>

<div id="field-collapse-` + entityId + `-` + entityFieldNumber + `" class="collapse show" aria-labelledby="headingOne"
    data-parent="#relationship-accordion">
    <div class="card-body">

        <div class="form-group">
            <label for="field-name">Field table name</label>
            <input type="text" class="form-control field-table-name"
                aria-describedby="fieldNameHelp" placeholder="Field table name">
            <small id="fieldNameHelp" class="form-text text-muted">Insert field table
                name</small>
        </div>

        <div class="form-group">
            <label for="field-name">Placeholder</label>
            <input type="text" class="form-control field-placeholder"
                aria-describedby="fieldNameHelp" placeholder="Field placeholder">
            <small id="fieldNameHelp" class="form-text text-muted">Insert field placeholder</small>
        </div>

        <div class="form-group">
            <label for="database-data-type">Field data type</label>
            <select class="form-control field-database-data-type">
                <option selected disabled>Select field data type</option>
                <option value="string">String</option>
                <option value="text">Text</option>
                <option value="integer">Integer</option>
                <option value="double">Double</option>
                <option value="date">Date</option>
                <option value="datetime">Datetime</option>
                <option value="image">Image</option>
                <option value="boolean">Boolean</option>
            </select>
        </div>

        <div class="form-group">
            <label for="input-data-type">Field input type</label>
            <select class="form-control field-input-data-type">
                <option selected disabled>Select field input type</option>
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="textarea">Textarea</option>
                <option value="file">File</option>
                <option value="date">Date</option>
                <option value="datetime">Datetime</option>
            </select>
        </div>

        <div class="form-check">
            <input class="form-check-input field-visibility" type="checkbox" value="">
            <label class="form-check-label" for="visible">
                Visible in table
            </label>
        </div>

    </div>
</div>
</div>`;
}

function getRelationshipItem(entityId, entityRelationshipNumber) {
    return `<div class="mt-2 card relationship-card">
<div class="card-header bg-warning" id="headingOne">
    <h5 class="mb-0">
        <button type="button" class="btn btn-link" data-toggle="collapse"
            data-target="#relationship-collapse-` + entityId + `-` + entityRelationshipNumber + `" aria-expanded="false" aria-controls="relationship-collapse-` + entityId + `-` + entityRelationshipNumber + `">
            Relationship ` + entityRelationshipNumber + `#
        </button>

        <button type="button" class="close remove-relationship" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </h5>
</div>

<div id="relationship-collapse-` + entityId + `-` + entityRelationshipNumber + `" class="collapse show" aria-labelledby="headingOne"
    data-parent="#accordion">
    <div class="card-body">

        <div class="form-group">
            <label for="database-data-type">Entity</label>
            <select id="relationship-entity-` + entityId + `-` + entityRelationshipNumber + `" class="form-control relationship-entity">
                <option selected disabled>Select foreign entity</option>
            </select>
        </div>

        <div class="form-group">
            <label for="field-name">Relationship name</label>
            <input type="text" class="form-control relationship-name"
                aria-describedby="fieldNameHelp" placeholder="Relationship name">
            <small id="fieldNameHelp" class="form-text text-muted">Insert relationship
                name</small>
        </div>

        <div class="form-group">
            <label for="field-name">Placeholder</label>
            <input type="text" class="form-control relationship-placeholder"
                aria-describedby="fieldNameHelp" placeholder="Field placeholder">
            <small id="fieldNameHelp" class="form-text text-muted">Insert field placeholder</small>
        </div>

        <div class="form-group">
            <label for="input-data-type">Foreign entity display field</label>
            <select class="form-control relationship-display-field">
                <option selected value="id">Select foreign entity display field (default: id)</option>
            </select>
        </div>

        <div class="form-check">
            <input class="form-check-input relationship-visibility" type="checkbox" value="">
            <label class="form-check-label" for="visible">
                Visible in table
            </label>
        </div>

    </div>
</div>
</div>`;
}

function getEntityCard(modelName, fields, relationships) {
    return `<div id="entity-` + modelName + `" class="card entity-card border-dark" style="width: 18rem;">
    <div class="card-header bg-primary">
        <h5>` + modelName + `</h5>
      </div>
    <ul class="list-group list-group-flush card-fields">
        ` + fields + `
    </ul>
    <ul class="list-group list-group-flush card-relationships">
        ` + relationships + `
    </ul>
    <div class="card-body bg-primary px-2 py-3">
        <div class="row">
            <div class="col-12 col-sm-6">
                <button data-model-name="` + modelName + `" class="edit-entity btn btn-info w-100">Edit</button>
            </div>
            <div class="col-12 col-sm-6">
                <button data-model-name="` + modelName + `" class="delete-entity btn btn-danger w-100">Delete</button>
            </div>
        </div>
    </div>
</div>`;
}

function getEntityCardFields(fieldName, fieldDatabaseType) {
    return `<li class="list-group-item list-group-item-action text-white bg-info list-group-item-info p-2">` + fieldName + ` (` + fieldDatabaseType + `)</li>`;
}

function getEntityCardRelationships(foreignKey, foreignEntity) {
    return `<li class="list-group-item list-group-item-action bg-warning list-group-item-info p-2"><span>` + foreignKey + `</span> (<span class="card-fk-model-name">` + foreignEntity + `</span>)</li>`;
}
