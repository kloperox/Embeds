/**
 * @name Embeds
 * @author !!Klopero
 * @authorId 328256407407296513
 * @invite kHe2KNzygB
 * @version 0.0.1
 * @description Umożliwia wysyłanie emblematów
 * @website 
 * @source 
 * @donate https://tipply.pl/u/BlackLifeRP
 */
 
 const config = {
    info: {
        name: 'Embeds',
        authors: [
            {
                name: '!!Klopero',
                github_username: '!!Klopero'
            }
        ],
        version: '0.0.1',
        description: 'Umożliwia wysyłanie emblematów',
        github: '',
        github_raw: ''
    }
};

module.exports = class {
    constructor() {
        this._config = config;
    }

    getName() {
        return config.info.name;
    }

    getAuthor() {
        return config.info.authors.map(author => author.name).join(', ');
    }

    getDescription() {
        return config.info.description;
    }

    getVersion() {
        return config.info.version;
    }

	load() {}
	unload() {}
	start() { this.attachHandler(); }
	onSwitch() { this.attachHandler(); }
	stop() {
		let el = document.querySelectorAll('form[class^="form-');
		if (el.length == 0) return;

		
		el[0].removeEventListener('keydown', this.handler);
	}

	attachHandler() {
		this.handler = this.handleKeypress.bind(this);
		let el = document.querySelectorAll('form[class^="form-');
		if (el.length == 0) return;
	
	
		el[0].addEventListener('keydown', this.handler, false);
	}

	
	sendEmbed(embed) {
		
		let channelID = BdApi.findModuleByProps('getChannelId').getChannelId();
	
		
		let MessageQueue = BdApi.findModuleByProps('enqueue');
		let MessageParser = BdApi.findModuleByProps('createBotMessage');
	
		let msg = MessageParser.createBotMessage(channelID, '');
	
		
		MessageQueue.enqueue({
			type: 0,
			message: {
				channelId: channelID,
				content: '',
				tts: false,
				nonce: msg.id,
				embed: embed
			}
		}, r => {
			return;
		});
	}

	
	handleKeypress(e) {
		var code = e.keyCode || e.which;

		if (code !== 13) {
			return;
		}

		if (e.shiftKey) {
			return;
		}

		
		function splitSingle(str, delimeter) {
			let part1 = str.substr(0, str.indexOf(delimeter));
			let part2 = str.substr(str.indexOf(delimeter) + 1);

			return [part1, part2]
		};

		
		function getDeepest(elem) {
			if(elem.firstChild == null) {
				return elem;
			} else {
				return getDeepest(elem.firstChild);
			}
		};

		
		let elements = Array.from(document.querySelectorAll('div[class^="textArea-')[0].children[0].children);
		let text = '';
		elements.forEach(function(l0) {
			Array.from(l0.children).forEach(function(l1) {
				Array.from(l1.children).forEach(function(elem) {
					elem = getDeepest(elem);
					if(elem.alt) {
						text += elem.alt;
					} else {
						text += elem.textContent;
					}
				});
			});
			text += '\n';
		});

		if (!text.startsWith('/e')) {
			return;
		};

		
		e.preventDefault();
		e.stopPropagation();

		
		text = text.replace('/e ', '');
		text = text.replace('\uFEFF', '');
		text = text.replace(/\n\n/g, '\n');
		text = text.split('\n');

		
		let fields = ['title', 'description', 'url', 'color', 'timestamp', 'footer_image', 'footer', 'thumbnail', 'image', 'author', 'author_url', 'author_icon'];
		let embed = {};
		let last_attrb = ''
		for (var x = 0; x < text.length; x++) {
			let line = text[x]
			let split = splitSingle(line, ':');

			
			if(fields.includes(split[0])) {
				
				if(split[1].startsWith(' ')) {
					embed[split[0]] = split[1].slice(1);
				} else {
					embed[split[0]] = split[1];
				}

				
				last_attrb = split[0];
			} else {
				embed[last_attrb] += '\n' + line;
			}
		}

		
		let unused = [];
		let keys = Object.keys(embed);
		for (var x = 0; x < keys.length; x++) {
			if (embed[keys[x]] == '') {
				unused.push(keys[x]);
			}
		}

		
		for (var x = 0; x < unused.length; x++) {
			delete embed[unused[x]];
		}

		
		embed.color = embed.color ? parseInt(embed.color.replace('#', ''), 16) : 0;

		
		let discordEmbed = {
			type: 'rich',
			footer: { text: '' },
			author: { name: '' }
		}
		keys = Object.keys(embed);
		for (var x = 0; x < keys.length; x++) {
			switch(keys[x]) {
				case 'timestamp':
					if (embed.timestamp.toLowerCase() == 'true') {
						let timestamp = (new Date).toISOString();
						discordEmbed.timestamp = timestamp;
					}
					break;
				case 'footer_image':
					discordEmbed.footer.icon_url = embed.footer_image;
					break;
				case 'footer':
					discordEmbed.footer.text = embed.footer;
					break;
				case 'thumbnail':
					discordEmbed.thumbnail = {};
					discordEmbed.thumbnail.url = embed.thumbnail;
					break;
				case 'image':
					discordEmbed.image = {};
					discordEmbed.image.url = embed.image;
					break;
				case 'author':
					discordEmbed.author.name = embed.author;
					break;
				case 'author_url':
					discordEmbed.author.url = embed.author_url;
					break;
				case 'author_icon':
					discordEmbed.author.icon_url = embed.author_icon;
					break;
				default:
					discordEmbed[keys[x]] = embed[keys[x]];
					break;
			}
		}

		
		console.log(this);
		this.sendEmbed(discordEmbed);

		this.lastKey = 0;
	}
};