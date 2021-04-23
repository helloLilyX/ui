export const api = (type, id, attributes) => {
    let json = '';

    switch (type) {
        case 'dms':
            json = require('./examples.json');
            json = json.data.submission.attachments;
            break;
        case 'email':
            json = require('./attachments.json');
            json = json.data.email.attachments;
            break;
        default:
            break;
    }

    if (!attributes) {
        return json;
    } else {
        attributes.push('id');
        attributes.push('filename');
        attributes.push('link');
        if (type === 'dms') {
            const directories = json.data.attributes.directory;
            Object.keys(directories).forEach(directory =>
                directories[directory].forEach((file) =>
                    Object.keys(file).forEach((attribute, k) =>
                        !attributes.includes(attribute) && delete file[attribute]
                    )
                )
            );
        } else if (type === 'attachments') {
            const files = json.data.attributes.files;
            Object.keys(files).forEach(file =>
                Object.keys(file).forEach((attribute, k) =>
                    !attributes.includes(attribute) && delete file[attribute]
                )
            );
        }

        return json;
    }
}