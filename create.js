var fs = require('fs');
var colors = require('colors');
var execSync = require('exec-sync');
var prompt = require('sync-prompt').prompt;

// Make sure sshpass is installed...
var test = execSync('which sshpass');
if (test === '') {
    console.log(colors.red('sshpass is not installed...'));
    var install = prompt('Do you wish to install it now? (y/n)');
    if (install === 'y') {
        console.log('Installing sshpass...');
        execSync('sudo apt-get -y install sshpass');
        console.log('Done.');
    } else {
        console.log('Script not created, aborting.');
        process.exit();
    }
}

console.log(colors.green('Let\'s create our bash script. Give me some variable values...'));

var localDb = {
    username: prompt(colors.yellow('Local DB username: ')),
    password: prompt(colors.yellow('Local DB password: ')),
    database: prompt(colors.yellow('Local DB database: '))
};

var remoteDb = {
    sshHostname: prompt(colors.cyan('Remote SSH hostname: ')),
    sshUsername: prompt(colors.cyan('Remote SSH username: ')),
    sshPassword: prompt(colors.cyan('Remote SSH password: ')),
    username: prompt(colors.cyan('Remote DB username: ')),
    password: prompt(colors.cyan('Remote DB password: ')),
    database: prompt(colors.cyan('Remote DB database: '))
};

var commandString = '';

commandString += 'mysql -u ' + localDb.username + ' ';
commandString += '-p' + localDb.password + ' ' + localDb.database + ' ';
commandString += '< <';
commandString += '(sshpass -p ' + remoteDb.sshPassword + ' ';
commandString += 'ssh ' + remoteDb.sshUsername + '@' + remoteDb.sshHostname + ' ';
commandString += '"mysqldump -u ' + remoteDb.username + ' ';
commandString += '-p' + remoteDb.password + ' ' + remoteDb.database + '")';

console.log(commandString);

var ok = prompt('Does this look ok? (y/n): ');

if (ok != 'y') {
    console.log('Aborted.');
    process.exit();
}

var filePath = 'dbsync.sh';

fs.writeFileSync(filePath, commandString);

console.log(colors.green('Done!'));
