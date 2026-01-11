class Program
{
    static void Main(string[] args)
    {
        double[] arr = Array.ConvertAll(Console.ReadLine().Split(' '), double.Parse);

        Console.WriteLine(arr[0] / arr[1]);
    }
}