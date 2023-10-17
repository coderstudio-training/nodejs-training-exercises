function getUserFromDatabase(userId, callback) {
    // Simulating database fetch with setTimeout
    setTimeout(() => {
        const users = [
            {id: 1, name: 'Alice'},
            {id: 2, name: 'Bob'},
        ];
        const user = users.find(u => u.id === userId);
        callback(null, user);
    }, 1000);
}

getUserFromDatabase(1, (err, user) => {
    if (err) {
        console.error('Error fetching user:', err);
        return;
    }
    console.log('User fetched:', user);
});
