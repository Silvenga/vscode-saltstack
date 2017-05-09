<Query Kind="Program">
  <NuGetReference>AngleSharp</NuGetReference>
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>AngleSharp</Namespace>
  <Namespace>AngleSharp.Dom.Html</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

async Task Main()
{
	var baseUrl = $"https://docs.saltstack.com/en/latest/ref/states/all/";

	var config = Configuration.Default.WithDefaultLoader();
	var document = await BrowsingContext
							.New(config)
							.OpenAsync(baseUrl);

	var modules = document.QuerySelectorAll("a.reference.internal[title]")
							.Cast<IHtmlAnchorElement>()
							.Select(x => new
							{
								Url = x.Href,
								Module = x.Title
							});

	var functions = new List<Function>();

	foreach (var mod in modules)
	{
		var module = await GetModule(mod.Url);
		functions.AddRange(module);
	}

	var json = JsonConvert.SerializeObject(functions);
	json.Dump();
}

async Task<IList<Function>> GetModule(string url)
{
	var config = Configuration.Default.WithDefaultLoader();
	var document = await BrowsingContext.New(config).OpenAsync(url);
	var functions = document.QuerySelectorAll(".function");

	return functions.Select(d => new Function
	{
		FunctionId = d.QuerySelector("dt").Id,
		Desciption = d.QuerySelector("dd > p")?.TextContent ?? "Unknown",
		Arguments = (from arg in d.QuerySelector("dt").QuerySelectorAll("em").Select(x => x.TextContent)
					 let parsed = ParseFunctionArgument(arg)
					 from desciption in Tranverse(d?.QuerySelector("dl")?.QuerySelectorAll("dt").FirstOrDefault(x => x?.TextContent == parsed.Name), x => x?.NextElementSibling)
					 				 .Where(x => x?.TagName == "DD")
									 .Take(1)
									 .Select(x => x?.TextContent)
									 .DefaultIfEmpty()
					 select new FunctionArgument
					 {
						 Name = parsed.Name,
						 DefaultValue = parsed.DefaultValue,
						 IsRequired = parsed.IsRequired,
						 Desciption = desciption ?? "Unknown"
					 })
					 .ToList()
	}).ToList();
}

public IEnumerable<T> Tranverse<T>(T input, Func<T, T> selector)
{
	T lastSeen = input;
	while ((lastSeen = selector(lastSeen)) != null)
	{
		yield return lastSeen;
	}
}

public FunctionArgument ParseFunctionArgument(string value)
{
	var parts = value.Split('=');
	var isRequired = parts.Length == 1 && !value.StartsWith("*");

	return new FunctionArgument
	{
		Name = parts.First(),
		IsRequired = isRequired,
		DefaultValue = isRequired ? null : parts.Last()
	};
}

public class FunctionArgument
{
	public string Name { get; set; }

	public string DefaultValue { get; set; }

	public bool IsRequired { get; set; }

	public string Desciption { get; set; }
}

public class Function
{
	public string FunctionId { get; set; }
	public string Desciption { get; set; }
	public IList<FunctionArgument> Arguments { get; set; }
}





