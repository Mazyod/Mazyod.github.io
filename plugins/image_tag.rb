# Title: Image tag with captions for Jekyll
# Authors: Brandon Mathis http://brandonmathis.com
#          Felix Schäfer, Frederic Hemberger
# Description: Easily output images with optional class names, width, height, title and alt attributes
#                     Use optional caption attribute to display title/alt text as caption
#
# Syntax {% img [class name(s)] [http[s]:/]/path/to/image [width [height]] [title text | "title text" ["alt text"]] %}
#
# Examples:
# {% img /images/ninja.png Ninja Attack! %}
# {% img left half http://site.com/images/ninja.png Ninja Attack! %}
# {% img left half http://site.com/images/ninja.png 150 150 "Ninja Attack!" "Ninja in attack posture" %}
#
# Output:
# <img src="/images/ninja.png">
# <img class="left half" src="http://site.com/images/ninja.png" title="Ninja Attack!" alt="Ninja Attack!">
# <img class="left half" src="http://site.com/images/ninja.png" width="150" height="150" title="Ninja Attack!" alt="Ninja in attack posture">

require 'fastimage'
module Jekyll

  class ImageTag < Liquid::Tag
    @img = nil

    def initialize(tag_name, markup, tokens)
      attributes = ['class', 'src', 'width', 'height', 'title']

      if markup =~ /(?<class>\S.*\s+)?(?<src>(?:https?:\/\/|\/|\S+\/)\S+)(?:\s+(?<width>\d+))?(?:\s+(?<height>\d+))?(?<title>\s+.+)?/i
        @img = attributes.reduce({}) { |img, attr| img[attr] = $~[attr].strip if $~[attr]; img }
        if /(?:"|')(?<title>[^"']+)?(?:"|')\s+(?:"|')(?<alt>[^"']+)?(?:"|')/ =~ @img['title']
          @img['title']  = title
          @img['alt']    = alt
        else
          @img['alt']    = @img['title'].gsub!(/"/, '&#34;') if @img['title']
        end
        @img['class'].gsub!(/"/, '') if @img['class']
      end
      super
    end

    def render(context)
      output = super
      if @img
        @img['src'] =~ /https?:\/\/[\S]+/ ? @imgsrc = @img['src'] : @imgsrc = "source" + @img['src']
        if @img['class'].include?("caption")
          if @img.has_key?("width")
            @imgwidth = @img['width']
          else
            @imgsize = FastImage.size(@imgsrc)
            @imgwidth = @imgsize[0] unless @imgsize.nil?
          end
          @imgclass = @img['class']
          @imgclass.slice!("caption")
          @img.delete("class")
          "<span class=\"#{('caption-wrapper ' + @imgclass).rstrip}\">" +
            "<img class=\"caption\" #{@img.collect {|k,v| "#{k}=\"#{v}\"" if v}.join(" ")}>" +
            "<span class=\"caption-text\">#{@img['alt']}</span>" +
          "</span>"
        else
            "<img #{@img.collect {|k,v| "#{k}=\"#{v}\"" if v}.join(" ")}>"
        end
      else
        "Error processing input, expected syntax: {% img [class name(s)] /url/to/image [width height] [title text] %}"
      end
    end
  end
end

Liquid::Template.register_tag('img', Jekyll::ImageTag)
