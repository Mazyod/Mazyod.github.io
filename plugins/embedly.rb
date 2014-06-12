# Title: trivial hack to use embed.ly in octopress
# Authors: Alexander Nikolaev <variomap@gmail.com>
#
# Syntax {% embedly url %}
#
 
require 'embedly'
 
module Jekyll
 
  class EmbedlyTag < Liquid::Tag
 
    def render(context)
      @markup.strip!
 
      if @markup =~ /^https?:/
        embedly = Embedly::API.new :key => context.registers[:site].config['embedly_key'],
          :user_agent => 'Mozilla/5.0 (compatible; tautology2/1.0; variomap@gmail.com)'
 
        if res = embedly.oembed(:url => @markup)
          res[0].html.gsub(/width\s*=\s*"\d+"/, 'width="100%"')
        else
          "Error processing '#{@markup}'" 
        end
      else
        @markup
      end
    end
  end
end
 
Liquid::Template.register_tag('embedly', Jekyll::EmbedlyTag)
