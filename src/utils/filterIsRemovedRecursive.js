function identity(doc) {
    return doc;
}

export default function filterIsRemovedRecursive(doc, tree) {
    Object
        .keys(tree)
        .forEach((key) => {
            const subtree = tree[key];
            const method = (typeof subtree === 'boolean') ? identity : filterIsRemovedRecursive;

            if (Array.isArray(doc[key])) {
                doc[key] = doc[key]
                    .filter(subdoc => !subdoc.isRemoved)
                    .map(subdoc => method(subdoc, subtree));
            } else {
                doc[key] = doc[key].isRemoved ?
                    null :
                    method(doc[key], subtree);
            }
        });

    return doc;
}
