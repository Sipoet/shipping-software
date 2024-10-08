module BreadcrumbGenerator

  def init_breadcrumb
    @breadcrumbs = []
  end

  def add_breadcrumb(path, name)
    @breadcrumbs << Breadcrumb.new(path: path, name: name)
    @breadcrumbs
  end

  class Breadcrumb
    attr_accessor :path, :name

    def initialize(options)
      @path = options[:path]
      @name = options[:name]
    end
  end
end
