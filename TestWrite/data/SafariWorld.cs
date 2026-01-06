class Program
{
    static void Main(string[] args)
    {
        long[] arr = Array.ConvertAll(Console.ReadLine().Split(), long.Parse);

        Console.WriteLine(Math.Abs(arr[0] - arr[1]));
    }
}