const { expect } = require('chai');
const Message = require('../../src/venom/parser.js')

describe('Whatsapp Parser', function() {
  var parser = new Message();
  var simple = "Something really interesting, "
                 + "I will call you later. "
                 + "Don't be sad for things that doesn't matter. "
                 + "I will be really surprised if someone would read it."

  describe('Message from Whatsapp', function() {

    it('check "!"', function() {
      const message = {
        body: "!command do.zip for me"
      }      

      result = parser.parseFromWhatsapp(message)
      expect(result).to.have.all.keys('isCommand', 'text', 'arguments', 'entry', 'axiom')
      expect(result.arguments).to.be.an('array')
      expect(result.arguments).to.have.members(["do.zip", "for", "me"])
      expect(result.entry).to.equal("command")
      expect(result.axiom).to.equal("!")

    });
    it('check "$"', function() {
      const message = {
        body: "$command hello world!"
      }

      const result = parser.parseFromWhatsapp(message)

      expect(result).to.have.all.keys('isCommand', 'text', 'arguments', 'entry', 'axiom')
      expect(result.arguments).to.be.an('array')
      expect(result.arguments).to.have.members(["hello", "world!"])
      expect(result.entry).to.equal("command")
      expect(result.axiom).to.equal("$")

    });
    it('check neither "$" or "!"', function() {
      const message = {
        body: "A natural language scheme, be advised!"
      }

      const result = parser.parseFromWhatsapp(message)

      expect(result).to.be.an('object')
      expect(result).to.have.all.keys('message', 'isCommand')
      expect(result.message).to.equal("A natural language scheme, be advised!")
      expect(result.isCommand).to.be.false;

    });
  });

  describe('Message to Whatsapp', function() {
    it('One message without attachments and less than 30 chars', function() {
      const message = {
        body: "You have 3 items on your list: "
              + "Go for a walk. Sit on the couch. drink soda."
      }

      const result = parser.parseToWhatsapp(message)

      expect(result).to.be.an('object');
      expect(result).to.have.all.keys(
        'original', 
        'text', 
        'hasAttachments', 
        'attachments'
      )
      expect(result.original).to.equal(message.body);
      expect(result.hasAttachments).to.be.false;
      expect(result.attachments).to.be.empty;

      const text = "You have 3 items on your list:\n"
                   + "_1._     Go for a walk.\n" 
                   + "_2._     Sit on the couch.\n" 
                   + "_3._     drink soda.\n"

      expect(result.text).to.equal(text)
    })

    it("Parse Simple message longer than 30 chars", function() {
      const message = {
        body: simple
      }

      const result = parser.parseToWhatsapp(message)

      const text = "Something really interesting,\n"
          + "I will call you later. Don't be\n"
          + "sad for things that doesn't matter.\n"
          + "I will be really surprised if\n"
          + "someone would read it."

      expect(result).to.be.an('object')
      expect(result).to.have.all.keys('original', 'text', 'hasAttachments', 'attachments')
      expect(result.original).to.equal(message.body);
      expect(result.hasAttachments).to.be.false;
      expect(result.attachments).to.be.empty;
      expect(result.text).to.equal(text)
    })

    it('simple and list messages', function() {
      const multiple = {
        body: [
          simple,
          "You have 3 items on your list: "
          + "Go for a walk. Sit on the couch. drink soda."
        ]
      }

      const simple_result = "Something really interesting,\n"
          + "I will call you later. Don't be\n"
          + "sad for things that doesn't matter.\n"
          + "I will be really surprised if\n"
          + "someone would read it.";

      const list_result = "You have 3 items on your list:\n"
                   + "_1._     Go for a walk.\n" 
                   + "_2._     Sit on the couch.\n" 
                   + "_3._     drink soda.\n";

      const result = parser.parseToWhatsapp(multiple)
      expect(result).to.be.an('object')
      expect(result).to.have.all.keys('original', 'text', 'hasAttachments', 'attachments')
      expect(result.original).to.be.an('array')
      expect(result.original).to.not.be.empty;
      expect(result.original[0]).to.equal(multiple.body[0]);
      expect(result.original[1]).to.equal(multiple.body[1]);

      expect(result.hasAttachments).to.be.false;
      expect(result.attachments).to.be.empty;
      expect(result.text).to.be.an('array')
      expect(result.text[0]).to.equal(simple_result)
      expect(result.text[1]).to.equal(list_result)
    })
  })
})
